import appointmentModel from '../models/appointmentModel.js'
import reportModel from '../models/reportModel.js'

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const slotToDate = (slotDate) => {
    const [day, month, year] = String(slotDate || '').split('_').map(Number)
    if (!day || !month || !year) return null
    return new Date(year, month - 1, day)
}

const rangeFor = (period, now = new Date()) => {
    if (period === 'monthly') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return { start, end }
    }
    const today = startOfDay(now)
    const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
    return { start, end }
}

const labelDate = (date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const sameCounts = (saved, counts) => (
    saved.booked === counts.booked
    && saved.completed === counts.completed
    && saved.cancelled === counts.cancelled
    && saved.paid === counts.paid
    && saved.upcoming === counts.upcoming
    && saved.patients === counts.patients
    && saved.earnings === counts.earnings
)

const fallbackSummary = (period, range, counts) => {
    const label = period === 'monthly' ? 'This month' : 'This week'
    return `${label} (${labelDate(range.start)} to ${labelDate(range.end)}) you have ${counts.booked} appointment${counts.booked === 1 ? '' : 's'}: ${counts.completed} completed, ${counts.cancelled} cancelled, and ${counts.upcoming} still upcoming. ${counts.patients} patient${counts.patients === 1 ? '' : 's'}. Earnings $${counts.earnings}.`
}

const askModel = async (period, range, counts) => {
    if (!process.env.GEMINI_API_KEY) return null
    const prompt = [
        'Write a 2 sentence report for one doctor. Use only the numbers given. Do not invent figures or give medical advice.',
        `Period: ${period}, ${labelDate(range.start)} to ${labelDate(range.end)}.`,
        `Booked: ${counts.booked}. Completed: ${counts.completed}. Cancelled: ${counts.cancelled}. Upcoming: ${counts.upcoming}. Paid: ${counts.paid}. Patients: ${counts.patients}. Earnings: $${counts.earnings}.`,
    ].join('\n')
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 },
            }),
        },
    )
    const data = await response.json()
    const text = String(data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim()
    return text || null
}

const countAppointments = (appointments) => {
    const patients = new Set()
    const counts = { booked: appointments.length, completed: 0, cancelled: 0, paid: 0, upcoming: 0, patients: 0, earnings: 0 }
    appointments.forEach((item) => {
        if (item.userId) patients.add(String(item.userId))
        if (item.cancelled) counts.cancelled += 1
        else if (item.isCompleted) counts.completed += 1
        else counts.upcoming += 1
        if (item.payment) counts.paid += 1
        if (item.isCompleted || item.payment) counts.earnings += item.amount || 0
    })
    counts.patients = patients.size
    return counts
}

const buildDoctorReport = async (docId, period) => {
    const range = rangeFor(period)
    const appointments = await appointmentModel.find({ docId: String(docId) })
    const inRange = appointments.filter((item) => {
        const visit = slotToDate(item.slotDate)
        if (!visit) return false
        return visit >= range.start && visit <= range.end
    })
    const counts = countAppointments(inRange)
    const saved = await reportModel.findOne({ docId: String(docId), period, start: range.start })
    if (saved && sameCounts(saved, counts) && saved.summary) {
        return saved
    }
    let summary = null
    let source = 'counts'
    try {
        summary = await askModel(period, range, counts)
        if (summary) source = 'model'
    } catch (error) {
        console.log(error)
    }
    if (!summary) summary = fallbackSummary(period, range, counts)
    return reportModel.findOneAndUpdate(
        { docId: String(docId), period, start: range.start },
        { ...counts, end: range.end, summary, source, period, docId: String(docId), start: range.start },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    )
}

export { buildDoctorReport }
