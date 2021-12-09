const jwt = require('jsonwebtoken')
const access_secret = process.env.ACCESS_TOKEN_SECRET
const refresh_secret = process.env.REFRESH_TOKEN_SECRET

class JwtService {
    async createAccesssToken(payload) {
        const access_token = await jwt.sign(payload, access_secret, { expiresIn: '1m' })
        return access_token
    }
    async createRefreshToken(payload) {
        const refresh_token = await jwt.sign(payload, refresh_secret, { expiresIn: '1y' })
        return refresh_token
    }
}

module.exports = new JwtService()