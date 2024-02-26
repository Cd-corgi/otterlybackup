const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const conModel = require('../../models/confession')
module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
    category: "misc",
    data: new SlashCommandBuilder()
        .setName("confession")
        .setDescription("send a confession to the confession channel!")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Provide your confession to send")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("anonymous")
                .setDescription("Do you want to make the confession in an anonymous source?")
                .setRequired(true)
        ),
    async run(client, interaction) {
        let mmsg = interaction.options.getString("message")
        let anom = interaction.options.getBoolean("anonymous")
        const confess = await conModel.findOne({ guildID: interaction.guild.id })
        if (!confess) return interaction.reply({ content: `The confession system is not enabled in this server`, ephemeral: true })
        if (client.cooldown.has(`confess-${interaction.user.id}-${interaction.guild.id}`)) return interaction.reply({ content: `**⌛ Hold Up!**\nYou are in Cooldown! Do this command <t:${Math.floor(client.cooldown.get(`confess-${interaction.user.id}-${interaction.guild.id}`) / 1000)}:R>`, ephemeral: true })
        let chan = interaction.guild.channels.cache.get(confess.channelID)
        if (mmsg.length < 5) return interaction.reply({ content: `The confession shoud be a bit long!`, ephemeral: true })
        const conEmbed = new EmbedBuilder().setTitle(`A new confession just landed!`).setColor("Random").setTimestamp()
        if (anom == false) {
            conEmbed.setDescription(`By **${interaction.user.username}**`)
            conEmbed.setThumbnail(interaction.user.displayAvatarURL())
            conEmbed.addFields({ name: `**Confession**`, value: `\`\`\`${mmsg}\`\`\`` })
        } else {
            conEmbed.setDescription(`By **Unknown User**`)
            conEmbed.setThumbnail(client.user.displayAvatarURL())
            conEmbed.addFields({ name: `**Confession**`, value: `\`\`\`${mmsg}\`\`\`` })
        }
        interaction.reply({ content: `✅ | Confession have been sent!`, ephemeral: true })
        chan.send({ embeds: [conEmbed] }).catch(err => { interaction.reply({ content: `Unknown error: The channel is not exists or it's deleted!`, ephemeral: true }) })
        client.cooldown.set(`confess-${interaction.user.id}-${interaction.guild.id}`, Date.now() + (45 * 1000))
        setTimeout(() => {
            client.cooldown.delete(`confess-${interaction.user.id}-${interaction.guild.id}`)
        }, 45000);
    }
}