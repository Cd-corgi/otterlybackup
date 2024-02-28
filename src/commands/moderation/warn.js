const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const warnSch = require('../../models/warn')

module.exports = {
    permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages],
    botp: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages],
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn someone! You can warn the member up to 3 times.")
        .addSubcommand(sub =>
            sub
                .setName("warn-user")
                .setDescription("Warn someone! (3rd warn it kicks the member)")
                .addUserOption(opt =>
                    opt
                        .setName("user")
                        .setDescription("Select an user to warn!")
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt
                        .setName("reason")
                        .setDescription("Give a reason to warn the user...")
                )

        )
        .addSubcommand(sub =>
            sub
                .setName("check-warns")
                .setDescription("Check someone's warn!")
                .addUserOption(opt =>
                    opt
                        .setName("user")
                        .setDescription("Select an user to check!")
                        .setRequired(true)
                )
        ),
    async run(client, interaction) {
        const sub = interaction.options.getSubcommand()
        const target = interaction.options.getUser("user")
        let reason = interaction.options.getString("reason")
        var consult; var row; var embeds = []; var id = 0;
        let collector; let filter;
        switch (sub) {
            case "warn-user":
                if (target.id == interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`You can't warn yourself!`).setColor("Random")], ephemeral: true })
                consult = await warnSch.findOne({ guildId: interaction.guild.id, userId: target.id })
                if (target.bot) return interaction.reply({ content: `You can't warn bots!`, epheeral: true })
                if (!reason) reason = "No Provided Reason"
                if (!consult) {
                    new warnSch({ guildId: interaction.guild.id, userId: target.id, warns: [{ reason, author: interaction.user.id }] }).save()
                    await interaction.deferReply()
                    return interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`${target.username} just got warned!`).setDescription(`**Reason**\n\`\`\`${reason}\`\`\``).setColor("Red").setTimestamp()] })
                } else {
                    if (consult.warns.length >= 3) {
                        try {
                            await target.kick({ reason: `The user have been kicked due to get over 3 warns!` })
                            await interaction.deferReply()
                            await warnSch.deleteOne({ guildId: interaction.guild.id, userId: target.id })
                            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`${target.username} have been kicked due to 3 warnings!`)] })
                        } catch (err) {
                            await interaction.deferReply()
                            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`There's an unknown error!`)] })
                        }
                        return;
                    }
                    consult.warns.push({ reason, author: interaction.user.id })
                    var uptd = await warnSch.findOneAndUpdate({ userId: target.id, guildId: interaction.guild.id }, { warns: consult.warns }, { new: true })
                    await interaction.deferReply()
                    interaction.followUp({ embeds: [new EmbedBuilder().setThumbnail(target.displayAvatarURL()).setTitle(`${target.username} have been warned by ${interaction.user.username}!`).setDescription(`Reason: \`${uptd.warns[uptd.warns.length - 1].reason}\``)] })
                }
                break;
            case "check-warns":
                consult = await warnSch.findOne({ guildId: interaction.guild.id, userId: target.id })
                if (target.bot) return interaction.reply({ content: `This is a bot, the bots can't be warned!`, ephemeral: true })
                if (!consult) {
                    return interaction.reply({ content: `The mentioned user has not any warn registered!`, ephemeral: true })
                } else {
                    row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("redo").setLabel("<").setStyle(ButtonStyle.Secondary)).addComponents(new ButtonBuilder().setCustomId("unwarn").setLabel("Remove Warn").setStyle(ButtonStyle.Success)).addComponents(new ButtonBuilder().setCustomId("forw").setLabel(">").setStyle(ButtonStyle.Secondary))
                    for (let idx = 0; idx < consult.warns.length; idx++) {
                        const embed = new EmbedBuilder().setTitle(`${target.username} warn list (${idx + 1} / ${consult.warns.length})`).setThumbnail(target.displayAvatarURL()).setColor("Random").addFields({ name: `Warn #1 (<t:${consult.warns[idx].warnDate}:R>)`, value: `**__From: <@${consult.warns[idx].author}>__**\`\`\`${consult.warns[idx].reason}\`\`\`` })
                        embeds.push(embed)
                    }
                    if (embeds.length < 2) { row.components[0].setDisabled(true); row.components[2].setDisabled(true); } else { row.components[0].setDisabled(true) }
                    // eslint-disable-next-line no-unused-vars
                    let msg = await interaction.reply({ embeds: [embeds[id]], components: [row] })
                    filter = i => i.user.id === interaction.user.id
                    collector = await interaction.channel.createMessageComponentCollector({ time: 30000, filter, idle: 7500 })
                    collector.on('collect', async (i) => {
                        await i.deferUpdate()
                        switch (i.customId) {
                            case "redo":
                                id--;
                                if (id !== 0) {
                                    row.components[1].setDisabled(false)
                                } else {
                                    row.components[0].setDisabled(true)
                                    row.components[2].setDisabled(false)
                                }
                                i.editReply({ embeds: [embeds[id]], components: [row] })
                                break;
                            case "unwarn":
                                consult.warns = consult.warns.filter((v) => v.warnDate != consult.warns[id].warnDate)
                                await i.editReply({ embeds: [new EmbedBuilder().setTitle(`✅ The warn have been removed!`).setColor("Green")], components: [] }).then(() => setTimeout(() => i.deleteReply(), 5000))
                                collector.stop()
                                break;
                            case "forw":
                                id++
                                if (id < embeds.length - 1) {
                                    row.components[0].setDisabled(false)
                                } else {
                                    row.components[0].setDisabled(false)
                                    row.components[2].setDisabled(true)
                                }
                                i.editReply({ embeds: [embeds[id]], components: [row] })
                                break;
                        }
                        collector.resetTimer()
                    });
                    // eslint-disable-next-line no-unused-vars
                    collector.on("end", async (_, reason) => {
                        try {
                            if (reason == "idle") {
                                interaction.editReply({ embeds: [embeds[id]], components: [] })
                            } else if (reason === "user") {
                                interaction.editReply({ embeds: [embeds[id]], components: [] })
                            }
                            return;
                        } catch (error) {
                            return;
                        }
                    })
                }
                break;
        }
    }
}