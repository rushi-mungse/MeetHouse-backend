const hashService = require('../services/hashService');
const otpService = require('../services/otpService')
class AuthController {
    async sendOtp(req, res, next) {
        //geting Phone from user
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ message: "All feilds are required!" })
        }
        //genarate OPT using crypto 
        const otp = await otpService.generateOtp()
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;

        const data = `${phone}.${otp}.${expires}`;
        //creating hash 
        const hashedOtp = await hashService.generateHash(data)

        try {
            // otpService.sendOtpBySms(phone, otp)
            res.json({
                phone,
                hashOtp: hashedOtp,
                otp
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ msg: "Something went wrong!" })
        }
    }
}

module.exports = new AuthController()