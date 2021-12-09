const express = require('express')
const authController = require('./controllers/authController')
const router = express.Router()

router.post('/api/send-otp', authController.sendOtp)
router.post('/api/verify-otp',authController.verifyOtp)

module.exports = router