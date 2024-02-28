const napi = require('@napi-rs/canvas')
const path = require('path')
const { fetchImage } = require('./loadimage')


module.exports = {
    /**
     * @param {Number} min The minimum number
     * @param {Number} max The maximum number
     * @returns A random number between the minimum number and maximum number
     */
    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /**
    * @param {*} client Declara el cliente de Discord
    * @param {*} member Declara el miembro entrante!
    * @param {*} guild Declara el servidor
    * @param {*} dbDoc Inserta el documento extraido de MONGODB
    * @returns The rendered image!
    */
    async generateImage(client, member, guild, dbDoc) {
        napi.GlobalFonts.registerFromPath(`${path.join(__dirname, '../', 'fonts')}/coolvetica.otf`, 'coolvetica')
        napi.GlobalFonts.registerFromPath(`${path.join(__dirname, '../', 'fonts')}/eazychat.ttf`, 'eazychat')
        var imageW = {}
        imageW.create = napi.createCanvas(1920, 1080)
        imageW.context = imageW.create.getContext("2d")
        if (dbDoc.content.imageID == "0") {
            imageW.context.roundRect(0, 0, 1920, 1080)
            imageW.context.fillStyle = "#000000"
            imageW.context.fill()
        } else {
            let getImagebg = await fetchImage(client, guild.id);
            await napi.loadImage(`${getImagebg}`).then(async image => {
                imageW.context.filter = 'blur(1px)'
                imageW.context.drawImage(image, 0, 0, 1920, 1080)
                imageW.context.filter = 'blur(1px)'
            })
        }
        imageW.context.roundRect(0, 0, 1920, 1080)
        imageW.context.globalAlpha = 0.7
        imageW.context.fillStyle = "#000000"
        imageW.context.fill()
        imageW.context.globalAlpha = 1
        imageW.context.fillStyle = "#FFFFFF"
        imageW.context.font = "200px eazychat"
        imageW.context.fillText(`Welcome`, 800, 526)
        if (member.username.length <= 5) {
            imageW.context.font = "105px coolvetica"
            imageW.context.fillText(`${member.username}`, 800, 606)
        } else
            if (member.username.length >= 5 && member.username.length <= 12) {
                imageW.context.font = "95px coolvetica"
                imageW.context.fillText(`${member.username}`, 800, 606)
            } else {
                imageW.context.font = "85px coolvetica"
                imageW.context.fillText(`${member.username}`, 800, 606)
            }
        imageW.context.fillStyle = "#FFFFFF"
        imageW.context.font = "75px coolvetica"
        imageW.context.fillText(`${guild.memberCount == 1 ? `${guild.memberCount}st` : guild.memberCount == 2 ? `${guild.memberCount}nd` : guild.memberCount == 3 ? `${guild.memberCount}rd` : `${guild.memberCount}th`} ${guild.memberCount < 2 ? `Member` : `Members`}`, 800, 696)
        imageW.context.beginPath()
        imageW.context.roundRect(350, 346, 400, 400, 20)
        imageW.context.fill()
        imageW.context.closePath()
        imageW.context.clip()
        await napi.loadImage(`${member.displayAvatarURL({ extension: "png", size: 1024 })}`).then(async img => { imageW.context.drawImage(img, 350, 346, 400, 400); })
        let encoded = await imageW.create.encode("png")
        return encoded
    },
    /**
    * @param {Number} millis Provide in MS the song duraction!
    * @returns It returns the formatted the time!
    */
    format(millis) {

        try {
            var s = Math.floor((millis / 1000) % 60);
            var m = Math.floor((millis / (1000 * 60)) % 60);
            var h = Math.floor((millis / (1000 * 60 * 60)) % 24);
            h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return h + ":" + m + ":" + s;
        } catch (e) {
            console.log(String(e.stack))
        }
    }
}