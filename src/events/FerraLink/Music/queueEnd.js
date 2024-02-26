const Discord = require('discord.js')
module.exports = async (client, player) => {
    const chan = client.channels.cache.get(player.textId)
    const Embed = new Discord.EmbedBuilder()
        .setTitle(`⏹ Queue Finished!`)
    Embed.setDescription(`Please consider Vote to me and make more Otters joins to our army of Fancy Otters 🦦`)
    let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel("Top.gg")
                .setEmoji("💬")
                .setURL("https://top.gg/bot/686245252717477966")
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel("Discord Bots.gg")
                .setEmoji("🤖")
                .setURL("https://discord.bots.gg/bots/686245252717477966")
        )
    player.destroy()
    return chan.send({ embeds: [Embed], components: [row] }).catch(err => { })
}