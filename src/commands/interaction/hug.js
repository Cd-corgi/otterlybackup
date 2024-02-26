const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const star = require('star-labs')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Hug an user!")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Provide the user to send hugs!")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)
        if (user.id == interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`No one? Don't worry :3 ${client.user.username} hugs you`).setImage(star.hug()).setFooter({ text: `Powered by ${client.user.tag}`, iconURL: client.user.displayAvatarURL() })], ephemeral: true })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user.username} Hugs ${member.user.username}`)
                    .setImage(star.hug())
                    .setColor("Random")
                    .setFooter({ text: `Powered by ${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
            ]
        })
    }
}