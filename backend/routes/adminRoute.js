import express from 'express'
import { loginAdmin, addDoctor, adminDashboard, appointmentsAdmin, appointmentCancel, allDoctors, changeAvailability, updateDoctor, deleteDoctor, allPatients } from '../controllers/admincontroller.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/doctors', authAdmin, allDoctors)
adminRouter.post('/update-doctor', authAdmin, upload.single('image'), updateDoctor)
adminRouter.post('/delete-doctor', authAdmin, deleteDoctor)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/patients', authAdmin, allPatients)

export default adminRouter
