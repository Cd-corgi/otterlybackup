const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "main",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Test the ping response!"),
    async run(client, interaction) {
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle("Ping!")
                .setColor("Random")
        ] })
    }
}