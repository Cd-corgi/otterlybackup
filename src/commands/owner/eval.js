const { inspect } = require('util')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js')
module.exports = {
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    botp: [Discord.PermissionFlagsBits.SendMessages],
    owner: true,
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Test some stuff in the system (ONLY THE OWNER CAN DO THIS)")
        .setDefaultMemberPermissions(0)
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription("write the code to eval")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const ccode = interaction.options.getString("code")
        try {
            const evaled = eval(ccode)
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Eval`)
                .setDescription(`\`\`\`js\n${inspect(evaled, { depth: 0 })}\`\`\``)
            await interaction.deferReply()
            interaction.followUp({
                embeds: [embed]
            })
        } catch (error) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Eval`)
                .setDescription(`\`\`\`js\n${error}\`\`\``)
            await interaction.deferReply()
            interaction.followUp({
                embeds: [embed]
            })
        }
    }
}