const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const routers = require('./routes')
const PORT = process.env.PORT || 5500
const DbConnect = require('./database')

app.use(express.json())
app.use(routers)
DbConnect()
app.listen(PORT, () => {
    console.log(`Linstening on port ${PORT}`)
})