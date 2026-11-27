import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    docId: { type: String, required: true },
    period: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    booked: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    upcoming: { type: Number, default: 0 },
    patients: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    source: { type: String, default: 'counts' },
}, { timestamps: true })

reportSchema.index({ docId: 1, period: 1, start: 1 }, { unique: true })

const reportModel = mongoose.models.Report || mongoose.model('Report', reportSchema)
export default reportModel
