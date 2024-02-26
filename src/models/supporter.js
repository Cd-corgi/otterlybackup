const mongoose = require('mongoose')

let schem = new mongoose.Schema({
    userId: String,
    tier: String,
    expiration: String
})

module.exports = new mongoose.model("supporter-tiers", schem)