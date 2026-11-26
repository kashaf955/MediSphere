import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

const signToken = (id) => jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET)

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email' })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
        }
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists' })
        }
        const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10))
        const user = await userModel.create({ name, email, password: passwordHash })
        res.status(201).json({ success: true, token: signToken(user._id) })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' })
        }
        res.json({ success: true, token: signToken(user._id) })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, gender, dob } = req.body
        if (!name || !phone || !address || !gender || !dob) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }
        const update = { name, phone, address, gender, dob }
        if (req.file) {
            if (!req.file.mimetype?.startsWith('image/')) {
                return res.status(400).json({ success: false, message: 'Profile photo must be an image' })
            }
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })
            update.image = uploadedImage.secure_url
        }
        await userModel.findByIdAndUpdate(req.userId, update)
        res.json({ success: true, message: 'Profile updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime, name, phone, gender, dob, address } = req.body
        if (!docId || !slotDate || !slotTime || !name || !phone || !gender || !dob || !address) {
            return res.status(400).json({ success: false, message: 'Please complete the booking form' })
        }
        const user = await userModel.findById(req.userId)
        const doctor = await doctorModel.findById(docId)
        if (!user || !doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }
        if (!doctor.available) {
            return res.status(400).json({ success: false, message: 'This doctor is not available' })
        }
        const slots_booked = { ...(doctor.slots_booked || {}) }
        const booked = Array.isArray(slots_booked[slotDate]) ? slots_booked[slotDate] : []
        if (booked.includes(slotTime)) {
            return res.status(400).json({ success: false, message: 'That slot is already booked' })
        }
        slots_booked[slotDate] = [...booked, slotTime]
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        await userModel.findByIdAndUpdate(req.userId, { name, phone, address, gender, dob })

        const docData = doctor.toObject()
        delete docData.password
        delete docData.slots_booked
        const appointment = await appointmentModel.create({
            userId: String(user._id),
            docId: String(doctor._id),
            slotDate,
            slotTime,
            userData: {
                name,
                email: user.email,
                phone,
                gender,
                dob,
                address,
                image: user.image,
            },
            docData,
            amount: doctor.fees,
            date: Date.now(),
        })
        res.status(201).json({ success: true, message: 'Appointment booked', appointmentId: appointment._id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const userAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: String(req.userId) }).sort({ date: -1 })
        const safe = appointments.map((item) => {
            const data = item.toObject()
            if (data.docData) delete data.docData.password
            return data
        })
        res.json({ success: true, appointments: safe })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment || appointment.userId !== String(req.userId)) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        const doctor = await doctorModel.findById(appointment.docId)
        if (doctor) {
            const slots_booked = { ...(doctor.slots_booked || {}) }
            const booked = slots_booked[appointment.slotDate]
            if (Array.isArray(booked)) {
                slots_booked[appointment.slotDate] = booked.filter((time) => time !== appointment.slotTime)
                await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked })
            }
        }
        res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const payAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment || appointment.userId !== String(req.userId)) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Cancelled appointments cannot be paid' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
        res.json({ success: true, message: 'Payment recorded' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, userAppointments, cancelAppointment, payAppointment }
