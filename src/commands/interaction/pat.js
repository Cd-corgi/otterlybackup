const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const star = require('star-labs')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("pat")
        .setDescription("Sends Pats to someone!")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Mention someone to Pat")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)
        if (user.id == interaction.user.id) return interaction.reply({ content: `Mention someone else, not yourself!`, ephemeral: true })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user.username} Pats ${member.user.username}`)
                    .setImage(star.pat())
                    .setColor("Random")
                    .setFooter({ text: `Powered by ${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
            ]
        })
    }
}