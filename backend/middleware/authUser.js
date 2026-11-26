import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            return res.status(401).json({ success: false, message: 'Please login to continue' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'user') {
            return res.status(401).json({ success: false, message: 'Please login to continue' })
        }
        req.userId = decoded.id
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: 'Please login to continue' })
    }
}

export default authUser
