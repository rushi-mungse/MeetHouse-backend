const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 5500

const routers = require('./routes')
const DbConnect = require('./database')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
const cors = require('cors')
const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
}
app.use(cors(corsOption))
app.use(express.json({ limit: '10mb' }))
app.use(routers)

//connect database
DbConnect()

app.listen(PORT, () => {
    console.log(`Linstening on port ${PORT}`)
})