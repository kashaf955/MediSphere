const SPECIALITIES = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
]

const KEYWORDS = [
    { speciality: 'Dermatologist', words: ['rash', 'skin', 'itch', 'acne', 'eczema', 'mole'] },
    { speciality: 'Neurologist', words: ['headache', 'migraine', 'seizure', 'numb', 'dizzy'] },
    { speciality: 'Gastroenterologist', words: ['stomach', 'nausea', 'digest', 'abdomen', 'vomit', 'acid'] },
    { speciality: 'Gynecologist', words: ['period', 'pregnan', 'menstrual', 'ovary', 'pelvic'] },
    { speciality: 'Pediatricians', words: ['child', 'baby', 'infant', 'toddler'] },
    { speciality: 'General physician', words: ['fever', 'cold', 'cough', 'flu', 'fatigue', 'throat'] },
]

const ageFromDob = (dob) => {
    if (!dob) return null
    const born = new Date(dob)
    if (Number.isNaN(born.getTime())) return null
    const now = new Date()
    let age = now.getFullYear() - born.getFullYear()
    const month = now.getMonth() - born.getMonth()
    if (month < 0 || (month === 0 && now.getDate() < born.getDate())) age -= 1
    return age
}

const fromProfile = (profile) => {
    const concern = String(profile.concern || '').toLowerCase()
    const matched = KEYWORDS.find((rule) => rule.words.some((word) => concern.includes(word)))
    if (matched) {
        return {
            speciality: matched.speciality,
            reason: `${matched.speciality} matches the concern on your profile.`,
            source: 'profile',
        }
    }
    if (SPECIALITIES.includes(profile.preferredSpeciality)) {
        return {
            speciality: profile.preferredSpeciality,
            reason: `Using your preferred speciality, ${profile.preferredSpeciality}.`,
            source: 'profile',
        }
    }
    const age = ageFromDob(profile.dob)
    if (age !== null && age < 16) {
        return {
            speciality: 'Pediatricians',
            reason: 'Pediatricians is a fit based on the age on your profile.',
            source: 'profile',
        }
    }
    return {
        speciality: 'General physician',
        reason: 'General physician is a starting point for this concern.',
        source: 'profile',
    }
}

const readModelJson = (text) => {
    const cleaned = String(text || '').replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    if (!SPECIALITIES.includes(parsed.speciality)) return null
    const reason = String(parsed.reason || '').trim()
    if (!reason) return null
    return { speciality: parsed.speciality, reason, source: 'model' }
}

const askModel = async (profile) => {
    const prompt = [
        'Choose one speciality for a clinic booking. Do not diagnose.',
        `Allowed specialities: ${SPECIALITIES.join(', ')}.`,
        'Reply with JSON only: {"speciality":"...","reason":"one short sentence"}.',
        `Concern: ${profile.concern || 'not provided'}`,
        `Preferred speciality: ${profile.preferredSpeciality || 'none'}`,
        `Gender: ${profile.gender || 'not specified'}`,
        `Birthday: ${profile.dob || 'not provided'}`,
    ].join('\n')

    if (process.env.GEMINI_API_KEY) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
                }),
            },
        )
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        return readModelJson(text)
    }

    if (process.env.OPENAI_API_KEY) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                temperature: 0.2,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: 'You choose a clinic speciality. You do not diagnose.' },
                    { role: 'user', content: prompt },
                ],
            }),
        })
        const data = await response.json()
        return readModelJson(data.choices?.[0]?.message?.content)
    }

    return null
}

const suggestSpeciality = async (profile) => {
    try {
        const fromModel = await askModel(profile)
        if (fromModel) return fromModel
    } catch (error) {
        console.log(error)
    }
    return fromProfile(profile)
}

export { SPECIALITIES, suggestSpeciality }
