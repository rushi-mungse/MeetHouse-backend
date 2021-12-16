const jwtService = require('../services/jwtService')

const authMiddleware = async (req, res, next) => {
    //get access_token from cookies using cookie-parser
    const { access_token } = req.cookies;
    console.log(req.cookies)  //token is valide or not
    try {
        if (!access_token) {
            throw new Error();
        }
        //verify access token
        const userData = await jwtService.verifyAceessToken(access_token)
        if (!userData) {
            throw new Error();
        }
        //set user properti on req object
        req.user = userData;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
module.exports = authMiddleware