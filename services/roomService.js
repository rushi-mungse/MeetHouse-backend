const RoomModule = require("../models/room");

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await RoomModule.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        })
        return room
    }
    async getRoom(types) {
        const rooms = await RoomModule.find({ roomType: { $in: types } }).populate('speakers').populate('ownerId').exec();
        return rooms
    }
    async getRoomInfoFromDatabase(id) {
        const room = await RoomModule.findOne({ _id: id }).populate('speakers').populate('ownerId').exec();
        return room
    }
}

module.exports = new RoomService()