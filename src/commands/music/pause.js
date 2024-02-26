const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    checkLive: true,
    category: "music",
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the current song!"),
    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id)
        if (!player) return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription(`❌ There's not songs playing right now`)], ephemeral: true })
        if (player.paused) return interaction.reply({ content: `⏸ | The queue is already paused`, ephemeral: true })
        try {
            player.pause()
            await interaction.deferReply()
            interaction.followUp({ embeds: [new EmbedBuilder().setDescription(`⏸ Queue Paused!`).setColor("Green")] })
        } catch (error) {
            interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setTitle("❌ Error").setDescription(error)] })
        }
    }
}