import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, userAppointments, cancelAppointment, payAppointment, suggestDoctors } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', authUser, getProfile)
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, userAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/pay-appointment', authUser, payAppointment)
userRouter.post('/suggest-doctors', authUser, suggestDoctors)

export default userRouter
