const { ContextMenuCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "context",
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setType(2),
    async run(client, interaction) {
        let user = await interaction.guild.members.fetch(interaction.targetId);

        const embed = new EmbedBuilder()
            .setAuthor({ iconURL: client.user.displayAvatarURL(), name: `Avatar of ${user.user.tag}` })
            .setDescription(`[\[Open Original\]](${user.user.displayAvatarURL({ extension: "png", size: 1024 })})`)
            .setImage(user.user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setFooter({ text: `Powered by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setColor("Random")

        interaction.reply({ embeds: [embed] })
    }
}