const roomService = require("../services/roomService");
const RoomDto=require('../dtos/RoomDto')

class RoomController {
    async createRoom(req, res) {
        //logic
        const { topic, roomType } = req.body;

        if (!topic || !roomType) {
            res.status(400).json({ message: 'All fields are required!' })
        }
     
        const room = await roomService.create({
            topic, roomType, ownerId: req.user.id
        })
        res.json(new RoomDto(room))
    }

    async index(req, res) {
        const rooms = await roomService.getRoom(['Open'])
        const allRooms = rooms.map((room) => new RoomDto(room))
        return res.json(allRooms)
    }
}

module.exports = new RoomController()