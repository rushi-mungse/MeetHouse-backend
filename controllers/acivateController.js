const Jimp = require('jimp')
const User = require('../models/user')
const path = require("path")
const UserDto = require('../dtos/userDto')

class ActivateController {
    async activate(req, res, next) {
        //validation
        const { name, username, avatar } = req.body
        if (!name || !username || !avatar) {
            return res.json("All feilds are required!")
        }
        //convert base64 file into png file
        const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
        const imgPath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`

        //jimp image processing library
        try {
            const jimpResp = await Jimp.read(buffer)
            jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../uploads/${imgPath}`));
        } catch (error) {
            res.status(500).json({ mgs: 'could not process the image' })
        }
        //get user id 
        const userId = req.user.id;
        //activate user 
        let user;
        try {
            user = await User.findOne({ _id: userId })
            if (!user) {
                res.status(500).json({ msg: 'user not found' })
            }
            user.activated = true;
            user.name = name;
            user.avatar = `/uploads/${imgPath}`
            user.username = username
            user.save()
            res.json({ user: new UserDto(user), auth: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'database error' })
        }
    }
}

module.exports = new ActivateController()