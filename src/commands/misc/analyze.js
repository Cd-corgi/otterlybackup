const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const Perspective = require('perspective-api-client')
const { TOKENS } = require('../../config/config.json')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "misc",
    data: new SlashCommandBuilder()
        .setName("analyze")
        .setDescription("Analize the text to check what a toxic words it is")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Provide the text to analyze if it is the enoguh toxic!")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const tt = interaction.options.getString("text")
        if (tt.length < 2) return interaction.reply({ content: `Provide a word at least to analyze!`, ephemeral: true })
        const perspective = new Perspective({ apiKey: TOKENS.API })
        try {
            const result = await perspective.analyze(tt)
            let obj = JSON.parse(JSON.stringify(result))
            let numR = `${parseInt(obj.attributeScores.TOXICITY.summaryScore.value * 100)}`
            var rounded = Math.ceil(numR)
            await interaction.deferReply()
            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`Your Toxic-o-meter`).setDescription(`Your word(s) contains around \`${rounded}%\` of toxicity!`).setColor("Green")] })
        } catch (error) {
            await interaction.deferReply()
            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`❌ Error`).setDescription(`${error}`).setColor("Red")] })
        }
    }
}