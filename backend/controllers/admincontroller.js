import doctorModel from '../models/doctorModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import cloudinary from 'cloudinary'

//API FOR ADDING DOCTORS

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, image, specialization, degree, experience, about, available, fees, address, date, slots_booked } = req.body
        const imageFile = req.file
        if(!name || !email || !password || !imageFile || !specialization || !degree || !experience || !about || !available || !fees || !address || !date || !slots_booked) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email' })
        }
        if(!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password is not strong' })
        }

       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password, salt)

       const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
       const imageUrl = uploadedImage.secure_url
       const doctorData = { name, email, password: hashedPassword, image: imageUrl, specialization, degree, experience, about, available, fees, address : JSON.parse(address), date, slots_booked }
       const newDoctor = new doctorModel(doctorData)
       await newDoctor.save()
       res.status(201).json({ message: 'Doctor added successfully', newDoctor })
      
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
export { addDoctor }