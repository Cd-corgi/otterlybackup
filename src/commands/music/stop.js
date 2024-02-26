const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    category: "music",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the music progress..."),
    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id)
        if (!player) return interaction.reply({ content: `You can't stop anything if there's not playing right now`, ephemeral: true })
        if (player.queue.current.info.requester.id !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`You can't stop the music if you are not the requester of the current song!`).setColor("Yellow")], ephemeral: true })
        try {
            player.loop = "none"
            player.queue.clear()
            player.skip()
            await interaction.deferReply()
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`⏹ The music have been stopped!`)
                        .setColor("Green")
                        .setTimestamp()
                ]
            }).then(() => setTimeout(() => interaction.deleteReply(), 4000))
        } catch (error) {
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`An error just appeared:\n${error}`).setColor("Red")], ephemeral: true })
        }
    }
}