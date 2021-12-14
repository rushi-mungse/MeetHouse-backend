const crypto = require('crypto')
const smsSid = process.env.SMS_SID
const smsAuthToken = process.env.SMS_AUTH_TOKEN
const twilio = require("twilio")(smsSid, smsAuthToken, {
    lazyLoading: true,
});
//ganerate otp using crypto
class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999)
        return otp;
    }
    //send otp to given phone using twllio service
    async sendOtpBySms(phone, otp) {
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your MeetHouse OTP is ${otp}`
        })
    }
}

module.exports = new OtpService()