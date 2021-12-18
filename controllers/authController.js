const User = require('../models/user')
const hashService = require('../services/hashService');
const otpService = require('../services/otpService')
const jwtService = require('../services/jwtService')
const UserDto = require('../dtos/userDto')
const Token = require('../models/token');
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
            return res.status(400).json({ msg: "Something went wrong!" })
        }
    }

    async verifyOtp(req, res, next) {
        //getting all the data from user
        const { phone, hashOtp, otp } = req.body

        //validation 
        if (!phone || !hashOtp || !otp) {
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
                //create user if not in database
                if (!user) {
                    user = await User.create({
                        phone
                    })
                }
            } else {
                return res.json({ message: "Please enter correct OTP." })
            }
        } catch (error) {
            return res.json({ message: "Something went wrong!" })
        }
        //creating token
        const access_token = await jwtService.createAccesssToken({ id: user._id })
        const refresh_token = await jwtService.createRefreshToken({ id: user._id })

        try {
            await Token.create({
                refresh_token,
                userId: user._id
            })
        } catch (error) {
            res.status(500).json({ message: 'something Went Wrong!' })
        }

        res.cookie('access_token', access_token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        res.cookie('refresh_token', refresh_token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        return res.json({ user: new UserDto(user), auth: true })
    }
    async refresh(req, res, next) {
        //get refresh token from cookies
        const { refresh_token: refreshToken } = req.cookies
      
        if (req.cookies === null) {
            res.status(500).json({ user: null, auth: false })
        }
        //verify refresh_token
        let userData;
        try {
            userData = await jwtService.verifyRefreshToken(refreshToken)
        } catch (error) {
            res.status(401).json({ message: 'Invalid Tokens' })
        }
        //check refresh_token in database or not
        try {  
            const token = await jwtService.checkTokenInDb(userData.id)
            if (!token) return res.status(401).json({ message: "Invalid Token" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server Error!' })
        }
        let user;
        try {
            user = await User.findOne({ _id: userData.id })
            if (!user) return res.status(404).json({ message: 'User not found!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error!" })
        }
        //creating token
        const access_token = await jwtService.createAccesssToken({ id: user._id })
        const refresh_token = await jwtService.createRefreshToken({ id: user._id })

        try {
            await Token.updateOne(
                { userId: user._id },
                { refresh_token: refresh_token }
            )
        } catch (error) {
            res.status(500).json({ message: 'Something Went Wrong!' })
        }

        res.cookie('access_token', access_token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.cookie('refresh_token', refresh_token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        return res.json({ user: new UserDto(user), auth: true })
    }

    async logout(req, res, next) {
        const { refresh_token } = req.cookies;
        await jwtService.removeTokens(refresh_token)
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        res.json({ user: null, auth: false })
    }

}

module.exports = new AuthController()