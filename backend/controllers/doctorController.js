import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

const safeAppointments = (appointments) => appointments.map((item) => {
    const data = item.toObject()
    if (data.docData) delete data.docData.password
    if (data.userData) delete data.userData.password
    return data
})

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' })
        }
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ docId: req.docId }).sort({ date: -1 })
        let earnings = 0
        const patients = []
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
        res.json({
            success: true,
            dashData: {
                earnings,
                appointments: appointments.length,
                patients: patients.length,
                latestAppointments: safeAppointments(appointments.slice(0, 5)),
            },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const doctorAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ docId: req.docId }).sort({ date: -1 })
        res.json({ success: true, appointments: safeAppointments(appointments) })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const findOwnAppointment = async (appointmentId, docId) => {
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment || String(appointment.docId) !== String(docId)) {
        return null
    }
    return appointment
}

const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await findOwnAppointment(appointmentId, req.docId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Cancelled appointments cannot be completed' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
        res.json({ success: true, message: 'Appointment completed' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await findOwnAppointment(appointmentId, req.docId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, isCompleted: false })
        const doctor = await doctorModel.findById(req.docId)
        const slots_booked = { ...(doctor?.slots_booked || {}) }
        const booked = slots_booked[appointment.slotDate]
        if (Array.isArray(booked)) {
            slots_booked[appointment.slotDate] = booked.filter((time) => time !== appointment.slotTime)
            await doctorModel.findByIdAndUpdate(req.docId, { slots_booked })
        }
        res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const doctorProfile = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.docId).select('-password')
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }
        res.json({ success: true, profile: doctor })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const updateDoctorProfile = async (req, res) => {
    try {
        const { fees, address, available, about } = req.body
        if (about === undefined || fees === undefined || address === undefined || available === undefined) {
            return res.status(400).json({ success: false, message: 'Missing profile details' })
        }
        await doctorModel.findByIdAndUpdate(req.docId, {
            fees: Number(fees),
            address,
            available: available === true || available === 'true',
            about,
        })
        res.json({ success: true, message: 'Profile updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export {
    loginDoctor,
    doctorDashboard,
    doctorAppointments,
    appointmentComplete,
    appointmentCancel,
    doctorProfile,
    updateDoctorProfile,
}
