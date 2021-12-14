const mongoose = require('mongoose')
const Schema = mongoose.Schema
//user Schema
const userSchema = new Schema({
    phone: { type: String, required: true },
    activated: { type: Boolean, required: false, default: false },
    name: { type: String, required: false },
    username: { type: String, required: false },
    avatar: { type: String, required: false }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema, 'users')