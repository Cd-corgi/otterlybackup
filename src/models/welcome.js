const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    guildId: String,
    isEnabled: { type: Boolean, default: false },
    channelId: { type: String, default: "0" },
    content: {
        title: { type: String, default: `{member}` },
        message: { type: String, default: `Welcome {member} to **{guild}**!\nAnd now we are {count} member(s)!` },
        imageID: String,
    }
})

module.exports = mongoose.model("Welcome-System", schema)