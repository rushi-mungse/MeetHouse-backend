const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    phone: { type: String, required: true },
    activated: { type: String, required: false, default: false }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema, 'users')