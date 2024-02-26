const Discord = require('discord.js')
const { format } = require('../../../utils/functions')
const sp = require('../../../models/supporter')
module.exports = async (client, player, track) => {
    const chan = client.channels.cache.get(player.textId);
    let suppo = await sp.findOne({ userId: track.info.requester.id })
    const pembed = new Discord.EmbedBuilder().setTitle(`${suppo && suppo.tier == "uspr" && suppo.expiration == undefined ? "👑 Now Playing ..." : "🦦 Now Playing ..."}`).setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif")
    let color = ""
    if (track.info.sourceName == "spotify") { color = "Green" } else if (track.info.sourceName == "soundcloud") { color = "Orange" } else if (track.info.sourceName == "youtube") { color = "Green" } else if (track.info.sourceName == "http") { color = "Purple"; pembed.setImage("https://media.discordapp.net/attachments/936271538196451379/1028764687082459236/lide-radio.png?width=1025&height=195") }
    pembed.setColor(color)
    pembed.addFields({ name: "💬 Song Title", value: `\`${track.info.author} - ${track.info.title}\`` }, { name: "📀 Duration", value: `\`${track.info.isStream == true ? "🔴 LIVE" : `${format(track.info.length)}`}\``, inline: true }, { name: "🦦 Requester", value: `${track.info.requester}`, inline: true },)
    pembed.setFooter({ text: `Powered by ${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
    chan.send({ embeds: [pembed] }).catch(err => { })
}