import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.atoken
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized' })
    }
}

export default authAdmin
