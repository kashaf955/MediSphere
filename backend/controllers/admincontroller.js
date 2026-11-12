import doctorModel from '../models/doctorModel.js'

//API FOR ADDING DOCTORS

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, image, specialization, degree, experience, about, available, fees, address, date, slots_booked } = req.body
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { addDoctor }