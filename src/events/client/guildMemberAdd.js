const Discord = require('discord.js')
const welSchem = require('../../models/welcome')
const { generateImage } = require('../../utils/functions')

module.exports = async (client, member) => {
    var welcomeSch = await welSchem.findOne({ guildId: member.guild.id })
    if (!welcomeSch || welcomeSch.isEnabled == false) return
    let getChan = await member.guild.channels.cache.get(welcomeSch.channelId)
    if (welcomeSch.content.imageID !== "0") {
        let getImg = await generateImage(client, member.user, member.guild, welcomeSch)
        let atch = new Discord.AttachmentBuilder(getImg, { name: `welcome-${member.user.id}.png` })
        const embed = new Discord.EmbedBuilder().setTitle(`${welcomeSch.content.title}`.replace("{member}", member.user.username).replace("{guild}", member.guild.name)).setDescription(`${welcomeSch.content.message}`.replace("{member}", member.user.username).replace("{guild}", member.guild.name).replace("{count}", member.guild.memberCount)).setColor("Random")
        getChan.send({ content: `${member.user}`, embeds: [embed.setImage(`attachment://welcome-${member.user.id}.png`)], files: [atch] })    
    } else {
        const embed = new Discord.EmbedBuilder().setTitle(`${welcomeSch.content.title}`.replace("{member}", member.user.username).replace("{guild}", member.guild.name)).setDescription(`${welcomeSch.content.message}`.replace("{member}", member.user.username).replace("{guild}", member.guild.name).replace("{count}", member.guild.memberCount)).setColor("Random")
        getChan.send({ content: `${member.user}`, embeds: [embed.setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 1024 }))] })
    }
}