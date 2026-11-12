import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: 'not specified'
    },
    dob: {
        type: Number,
        default: 'not specified'
    },
    phone: {
        type: String,
        default: '0000000000'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})  

const userModel = mongoose.models.User || mongoose.model('User', userSchema)
export default userModel