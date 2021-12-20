const express = require('express')
const router = express.Router()

const activateController = require('./controllers/acivateController')
const authController = require('./controllers/authController')
const auth = require('./middlewares/authMiddleware')
const roomController=require('./controllers/roomController')
//all routes
router.post('/api/send-otp', authController.sendOtp)
router.post('/api/verify-otp', authController.verifyOtp)
router.post('/api/activate', auth, activateController.activate)
router.get('/api/refresh',authController.refresh)
router.post('/api/logout',auth,authController.logout)
router.post('/api/create-room',auth,roomController.createRoom)
router.get('/api/getRoom',auth,roomController.index)
router.post('/api/getRoomInfo',auth,roomController.roomInfo)


module.exports = router