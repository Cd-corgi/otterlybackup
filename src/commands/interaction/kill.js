const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const star = require('star-labs')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("kill")
        .setDescription("Kill an user!")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Provide the user to Kill")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)
        if (user.id == interaction.user.id) return interaction.reply({ content: `Sorry, you can't give a likk yourself`, ephemeral: true })
        await interaction.deferReply()
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.user.username} got killed by ${interaction.user.username}`)
                    .setImage(star.kill())
                    .setColor("Random")
                    .setFooter({ text: `Powered by ${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
            ]
        })
    }
}