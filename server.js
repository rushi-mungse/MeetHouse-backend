const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const routers = require('./routes')
const PORT = process.env.PORT || 5500

app.use(routers)

app.listen(PORT, () => {
    console.log(`Linstening on port ${PORT}`)
})