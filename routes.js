const express = require('express')
const router = express.Router()

const activateController = require('./controllers/acivateController')
const authController = require('./controllers/authController')
const auth = require('./middlewares/authMiddleware')

//all routes
router.post('/api/send-otp', authController.sendOtp)
router.post('/api/verify-otp', authController.verifyOtp)
router.post('/api/activate', auth, activateController.activate)


module.exports = router