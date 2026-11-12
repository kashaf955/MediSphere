import express from 'express'
import { addDoctor } from '../controllers/admincontroller.js'

const router = express.Router()

router.post('/add-doctor', addDoctor)

export default router