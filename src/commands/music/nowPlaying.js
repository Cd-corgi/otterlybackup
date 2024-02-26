const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const { format } = require('../../utils/functions')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    category: "music",
    data: new SlashCommandBuilder()
        .setName("now-playing")
        .setDescription("See what is the now playing song!"),
    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id)
        if (!player) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`❌ | There's no music playing right now!`).setColor("Red")] })
        const npembed = new EmbedBuilder().setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif").setTitle(`${player.queue.paused ? "⏸" : "▶"} Now Playing`)
        let color = ""
        const part = Math.floor((player.shoukaku.position / player.queue.current.info.length) * 30);
        if (player.queue.current.info.sourceName == "spotify") { color = "Green" } else if (player.queue.current.info.sourceName == "souncould") { color = "Orange" } else if (player.queue.current.info.sourceName == "http") { color = "Purple"; npembed.setImage("https://media.discordapp.net/attachments/936271538196451379/1028764687082459236/lide-radio.png?width=1025&height=195") } else { color = "Green" }
        npembed.addFields({ name: "💬 Song Title", value: `\`${player.queue.current.info.author} - ${player.queue.current.info.title}\``, inline: true }, { name: "🦦 Requester", value: `${player.queue.current.info.requester}`, inline: true },)
        npembed.setColor(color)
        if (player.queue.current.info.isStream == false) { npembed.addFields({ name: "🎶 Progress", value: `${player.queue.current.info.isStream ? "\`🔴 LIVE\`" : `\`${format(player.shoukaku.position)}\` \`[${"#".repeat(part) + "#" + "-".repeat(30 - part)}]\` \`${format(player.queue.current.info.length)}\``}` }) }
        await interaction.deferReply()
        interaction.followUp({ embeds: [npembed] })
    }
}