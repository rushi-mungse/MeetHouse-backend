const User = require('../models/user')
const hashService = require('../services/hashService');
const otpService = require('../services/otpService')
class AuthController {
    async sendOtp(req, res, next) {
        //getting Phone from user
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ message: "All fields are required!" })
        }
        //genarate OPT using crypto 
        const otp = await otpService.generateOtp()
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;

        const data = `${phone}.${otp}.${expires}`;
        //creating hash 
        const hashedOtp = await hashService.generateHash(data)

        //OTP send to user 
        try {
            // otpService.sendOtpBySms(phone, otp)
            res.json({
                phone,
                hashOtp: `${hashedOtp}.${expires}`,
                otp
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ msg: "Something went wrong!" })
        }
    }
    async verifyOtp(req, res, next) {
        //getting all the data from user
        const { phone, hashOtp, otp } = req.body
        //validation 
        if (!phone && !hashOtp && !otp) {
            return res.status(401).json({ message: 'All fields are required!' })
        }

        const [hash, expires] = hashOtp.split('.')
        //check otp is expire or not 
        if (Date.now() > +expires) {
            return res.status(500).json({ msg: "OTP expired!" })
        }

        const data = `${phone}.${otp}.${expires}`
        //check otp is correct or not
        const hashedOtp = await hashService.generateHash(data)
        let user;
        try {
            if (hash === hashedOtp) {
                user = await User.findOne({ phone })
                if (!user) {
                    await User.create({
                        phone
                    })
                }
            } else {
                return res.json({ message: "Please enter correct OTP." })
            }
        } catch (error) {
            return res.json({ message: "Something went wrong!" })
        }
       return res.json({ msg: 'All Good!' })
    }
}

module.exports = new AuthController()