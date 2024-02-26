const mongoose = require('mongoose')
const { mongo } = require('../config/config.json')

module.exports = async () => {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(mongo).then(() => console.log("🍃 Connected"))
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}