const mongoose = require('mongoose')

let schem = new mongoose.Schema({
    guildId: String,
    blocked: [{
        category: String
    }]
})

module.exports = new mongoose.model("blocked-Categories", schem)