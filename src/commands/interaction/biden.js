const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("biden")
        .setDescription("Make Biden post a Tweet!")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Give a text to the tweet!")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const tt = interaction.options.getString("text")
        if (tt.length > 400 || tt.length < 1) return interaction.reply({ content: `Text out of the range!`, ephemeral: true })
        const biden = new EmbedBuilder().setTitle(`Joe Biden just post a Tweet`).setImage(`https://api.popcat.xyz/biden?text=${tt.replace(/\s/g, "+")}`)
        await interaction.deferReply()
        interaction.followUp({ embeds: [biden] })
    }
}