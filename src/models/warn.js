const mongoose = require('mongoose')
const moment = require('moment')

const Schem = new mongoose.Schema({
    guildId: String,
    userId: String,
    warns: [{
        reason: String,
        author: String,
        warnDate: { type: String, default: Math.floor(Date.parse(moment(Date.now())) / 1000) }
    }]
})

module.exports = mongoose.model("warn-list", Schem)