
const mongoose = require('mongoose')
const DB_URL = process.env.MONGO_URL
//connection of database
function DbConnect() {

    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
        console.log('DB Connected..')
    });

}

module.exports = DbConnect