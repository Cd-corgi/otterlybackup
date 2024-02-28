const { EmbedBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { ownerID } = require('../../config/config.json')
module.exports = async (client, interaction) => {
    if (interaction.type == Discord.InteractionType.ApplicationCommand) {
        let slashCmd = client.commands.get(interaction.commandName)
        if (!slashCmd) return;
        const user = interaction.guild.members.cache.get(interaction.user.id);
        if (!user.permissions.has(slashCmd.permissions || [])) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(":x: | Permission Error")
                        .setDescription(`Please get the enough permissions to do the commands!\nPermissions:\n\`${new Discord.PermissionsBitField(slashCmd.permissions).toArray().join("\`, \`")}\``)
                        .setTimestamp()
                        .setColor(Discord.Colors.Red)
                ],
                ephemeral: true
            })
        }
        if (!interaction.guild.members.me.permissions.has(slashCmd.botP || [])) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(":x: | Permission Error")
                        .setDescription(`Please give me the enough permissions to do the commands!\nPermissions:\n\`${new Discord.PermissionsBitField(slashCmd.botP).toArray().join("\`, \`")}\``)
                        .setTimestamp()
                        .setColor(Discord.Colors.Red)
                ],
                ephemeral: true
            })
        }
        if (slashCmd.owner && interaction.user.id !== ownerID) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`Warning`)
                        .setDescription(`This and other commands is just for the owner of the bot!`)
                        .setColor("Red")
                ],
                ephemeral: true
            })
        }
        if (slashCmd.inVoiceChannel && !interaction.member.voice.channel) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`You should be in a \`Voice Channel\` first`)
                        .setColor(Discord.Colors.Yellow)
                ],
                ephemeral: true
            })
        }
        if (slashCmd.inVoiceChannel && interaction.guild.members.me.voice.channel && interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`You should be in the same \`Voice Channel\` where i am`)
                        .setColor(Discord.Colors.Yellow)
                ],
                ephemeral: true
            })
        }
        if (slashCmd.checkLive) {
            const player = client.manager.players.get(interaction.guild.id);
            if (player) {
                if (player.queue.current.info.isStream) {
                    await interaction.deferReply()
                    return interaction.followUp({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setDescription(`There's a Live Stream or Radio playing right now! use \`/stop\` to disable it`)
                                .setColor("Red")
                        ]
                    })
                }
            }
        }
        try {
            await slashCmd.run(client, interaction)
        } catch (error) {
            console.log("\x1b[41m", error, "\x1b[0m")
        }
    }
}