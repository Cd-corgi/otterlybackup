const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    category: "music",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Check the current songs in the queue!"),
    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id)
        if (!player) return interaction.reply({ content: `There's no songs playing!`, ephemeral: true })
        let queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue
        await interaction.deferReply()
        const Equeue = new EmbedBuilder().setTitle(`📜 ${client.user.username}'s Queue`).setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif").addFields({ name: "📀 Current Song", value: `\`${player.queue.current.info.author} - ${player.queue.current.info.title}\`` })
        let songs = ""
        queue.map((v, i) => { songs += `> **${i + 1}** \`${v.info.author} - ${v.info.title}\`\n` })
        if (queue.length) Equeue.addFields({ name: `🎶 Queued Songs [${player.queue.length} songs]`, value: `${songs.substring(0, 2048)}` })
        interaction.followUp({ embeds: [Equeue.setFooter({ text: `Powered with ❤ and FerraLink`, iconURL: client.user.displayAvatarURL() })] })
    }
}