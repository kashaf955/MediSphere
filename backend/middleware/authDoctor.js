import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
    try {
        const token = req.headers.dtoken
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.docId = decoded.id
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized' })
    }
}

export default authDoctor
