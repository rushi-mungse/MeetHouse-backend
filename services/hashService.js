const crypto = require('crypto')
class HashOtp {
    //generate hash for given data using crypto
    async generateHash(data) {
        return await crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest("hex")
    }
}

module.exports = new HashOtp()