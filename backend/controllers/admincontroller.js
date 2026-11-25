import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

const safeAppointments = (appointments) => appointments.map((item) => {
    const data = item.toObject()
    if (data.docData) delete data.docData.password
    if (data.userData) delete data.userData.password
    return data
})

const addressText = (address) => {
    if (!address) return ''
    if (typeof address === 'object') {
        return [address.line1, address.line2].filter(Boolean).join(', ')
    }
    try {
        const parsed = JSON.parse(address)
        if (parsed && typeof parsed === 'object') {
            return [parsed.line1, parsed.line2].filter(Boolean).join(', ') || String(address)
        }
    } catch {
        return String(address)
    }
    return String(address)
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' })
        }
        const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, degree, experience, about, available, fees, address } = req.body
        const imageFile = req.file
        if (!name || !email || !password || !imageFile || !specialization || !degree || experience === undefined || experience === '' || !about || available === undefined || fees === undefined || fees === '' || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email' })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: 'Password must be 8+ characters with upper, lower, number, and symbol' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: uploadedImage.secure_url,
            specialization,
            degree,
            experience: Number(experience),
            about,
            available: available === true || available === 'true',
            fees: Number(fees),
            address: addressText(address),
            date: Date.now(),
            slots_booked: {},
        }
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        const saved = newDoctor.toObject()
        delete saved.password
        res.status(201).json({ success: true, message: 'Doctor added successfully', newDoctor: saved })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.code === 11000 ? 'A doctor with this email already exists' : 'Internal server error' })
    }
}

const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.countDocuments()
        const appointments = await appointmentModel.find({}).sort({ date: -1 })
        const patients = []
        appointments.forEach((item) => {
            if (!patients.includes(item.userId)) patients.push(item.userId)
        })
        res.json({
            success: true,
            dashData: {
                doctors,
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

const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}).sort({ date: -1 })
        res.json({ success: true, appointments: safeAppointments(appointments) })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, isCompleted: false })
        const doctor = await doctorModel.findById(appointment.docId)
        const slots_booked = { ...(doctor?.slots_booked || {}) }
        const booked = slots_booked[appointment.slotDate]
        if (Array.isArray(booked)) {
            slots_booked[appointment.slotDate] = booked.filter((time) => time !== appointment.slotTime)
            await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked })
        }
        res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password').sort({ createdAt: -1 })
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const doctor = await doctorModel.findById(docId)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }
        doctor.available = !doctor.available
        await doctor.save()
        res.json({ success: true, message: 'Availability updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export { loginAdmin, addDoctor, adminDashboard, appointmentsAdmin, appointmentCancel, allDoctors, changeAvailability }
