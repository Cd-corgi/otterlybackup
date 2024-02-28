const { guildBank } = require('../config/config.json')
const welSchem = require('../models/welcome')

module.exports = {
    /**
     * @param {*} client Añade el Client del bot para controlar los paramentros!
     * @param {*} guildId colocal la ID del servidor a obtener la imagen
     */
    async fetchImage(client, guildId) {
        let getImage = await welSchem.findOne({ guildId: guildId })
        var getBank = await client.guilds.fetch(guildBank.guild)
        var getC = await getBank.channels.cache.get(guildBank.channel)
        let getmsg = await getC.messages.fetch(getImage.content.imageID)
        return Array.from(getmsg.attachments)[0][1].attachment
    }
}