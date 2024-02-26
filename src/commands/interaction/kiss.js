const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const star = require('star-labs')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("kiss")
        .setDescription("Kiss an user!")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Provide the user to send a kiss")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)
        if (user.id == interaction.user.id) return interaction.reply({ content: `Sorry, you can't give a kiss for yourself :'(`, ephemeral: true })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user.username} just kissed ${member.user.username}`)
                    .setImage(star.kiss())
                    .setColor("Random")
                    .setFooter({ text: `Powered by ${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
            ]
        })
    }
}