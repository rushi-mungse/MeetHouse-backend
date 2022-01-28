const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 5500

const routers = require('./routes')
const DbConnect = require('./database')
const cookieParser = require('cookie-parser')
const server = require('http').createServer(app);
const ACTIONS = require('./actions')
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: ["GET", ["POST"]]
    }
})

//connect database
DbConnect()

app.use(cookieParser())
const cors = require('cors')
const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
}
app.use(cors(corsOption))
app.use(express.json({ limit: '10mb' }))
app.use(routers)
app.use('/uploads', express.static('uploads'))
const socketMapping = {}
io.on("connection", (socket) => {
    // console.log('connection...', socket.id);
    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketMapping[socket.id] = user;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user
            })
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketMapping[clientId]
            })
        })

        socket.join(roomId)
        // console.log(clients);

    })
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate
        })
    })

    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDiscription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDiscription
        })
    })
    const leaveRoom = ({ roomId }) => {
        const { rooms } = socket;
        Array.from(rooms).forEach(roomId => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketMapping[socket.id]?._id
                })
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketMapping[clientId]?._id,
                })

            })
            socket.leave(roomId)
        })
        delete socketMapping[socket.id];
    }
    socket.on(ACTIONS.LEAVE, leaveRoom)
    socket.on('disconnecting',leaveRoom)
})

server.listen(PORT, () => {
    console.log(`Linstening on port ${PORT}`)
}) 