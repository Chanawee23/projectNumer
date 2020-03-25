const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://chompoo:chomfing23@cluster0-qbv5p.azure.mongodb.net/cinema?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db