const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    refresh_token: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Token', tokenSchema, 'tokens')
