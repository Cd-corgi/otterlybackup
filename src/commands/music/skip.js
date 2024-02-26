const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    botp: [PermissionFlagsBits.Connect, PermissionFlagsBits.SendMessages],
    inVoiceChannel: true,
    checkLive: true,
    category: "music",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song to the next one!"),
    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id)
        if (!player) return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription(`❌ There's not songs playing right now`)], ephemeral: true })
        if (player.queue.length < 1) return interaction.reply({ embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`⚠ There's no more songs to skip`)], ephemeral: true })
        if (player.queue.current.info.requester.id !== interaction.user.id) return interaction.reply({ content: `⚠ | \`You can't skip if you are not who put this song!\``, ephemeral: true })
        try {
            await player.skip()
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`⏩ Skipping...`).setColor(`Random`)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000))
        } catch (error) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle("❌ Error").setDescription(`${error}`).setColor("Red")] })
        }
    }
}