const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("sins")
        .setDescription("Put a text to make it your most deepest sins!")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Put a text to express your sins")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(100)
        ),
    async run(client, interaction) {
        const text = interaction.options.getString("text")
        const embed = new EmbedBuilder()
            .setImage(`https://api.popcat.xyz/unforgivable?text=${text.replace(/\s/g, "+")}`)
        await interaction.deferReply()
        interaction.followUp({ embeds: [embed] })

    }
}