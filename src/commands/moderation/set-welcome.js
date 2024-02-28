const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const welcomeSchema = require('../../models/welcome')
const { guildBank } = require('../../config/config.json')
module.exports = {
    permissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages],
    botp: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Manage the welcome system!")
        .addSubcommand(sub =>
            sub
                .setName("enable-system")
                .setDescription("Enable the welcome system!")
        )
        .addSubcommand(sub =>
            sub
                .setName("set-channel")
                .setDescription("Set the output channel where the welcome message will be sent")
                .addChannelOption(opt =>
                    opt
                        .setName("channel")
                        .setDescription("Add a channel where the message will be sent on there!")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName("set-message")
                .setDescription("Set the message that will be setted up as welcome message!")
        )
        .addSubcommand(sub =>
            sub
                .setName("set-image")
                .setDescription("Add an image to the welcome message!")
                .addAttachmentOption(opt =>
                    opt
                        .setName("image")
                        .setDescription("Loan a .PNG or .JPG image format. (leave it in blank to remove it!)")
                )
        ),
    async run(client, interaction) {
        const subCommands = interaction.options.getSubcommand()
        let targetChannel = interaction.options.getChannel("channel")
        let imageTarget = interaction.options.getAttachment("image")
        var consult;
        switch (subCommands) {
            case "enable-system":
                consult = await welcomeSchema.findOne({ guildId: interaction.guild.id })
                if (!consult) {
                    return new welcomeSchema({
                        guildId: interaction.guild.id,
                        isEnabled: true,
                    }).save()
                        .then(async () => {
                            await interaction.deferReply({ ephemeral: true })
                            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ You just enabled the welcome system!`).setColor("Green").setTimestamp()] })
                        })
                } else {
                    if (consult.isEnabled == true) {
                        await welcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { isEnabled: false })
                        interaction.reply({ embeds: [new EmbedBuilder().setTitle(`✔ The welcome system have been disabled!`).setColor("Red")] })
                    } else {
                        await welcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { isEnabled: true })
                        interaction.reply({ embeds: [new EmbedBuilder().setTitle(`✔ The welcome system have been enabled!`).setColor("Green")] })
                    }
                }
                break;
            case "set-channel":
                consult = await welcomeSchema.findOne({ guildId: interaction.guild.id })
                if (!consult) {
                    return new welcomeSchema({
                        guildId: interaction.guild.id,
                        channelId: targetChannel.id
                    }).save()
                        .then(async () => {
                            await interaction.deferReply({ ephemeral: true })
                            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ The channel ${targetChannel} have been setted up as a welcome channel!`).setColor("Green").setTimestamp()] })
                        })
                } else {
                    await welcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { channelId: targetChannel.id })
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`✔ The Channel ${targetChannel} have been setted up as welcome channel!`)
                                .setColor("Green")
                        ]
                    })
                }
                break;
            case "set-message":
                consult = await welcomeSchema.findOne({ guildId: interaction.guild.id })
                var modal = new ModalBuilder().setCustomId("message").setTitle("Edit the Welcome Message!")
                var Wtitle = new TextInputBuilder().setCustomId("welTitle").setLabel("Edit the Welcome Title!").setStyle(TextInputStyle.Short).setPlaceholder("Sintax: {member} = user | {guild} = Server name"); var Wmsg = new TextInputBuilder().setCustomId("welMsg").setLabel("Edit the Welcome Message!").setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder("Sintax: {member} = user | {guild} = Server name | {count} = user count!")
                var row1 = new ActionRowBuilder().addComponents(Wtitle); var row2 = new ActionRowBuilder().addComponents(Wmsg)
                modal.addComponents(row1, row2)
                await interaction.showModal(modal)
                var submit = await interaction.awaitModalSubmit({ time: 900000 }).catch(e => console.log(e))
                if (submit) {
                    var getdata = submit.fields;
                    if (!consult) {
                        return welcomeSchema({
                            guildId: submit.guild.id,
                            content: {
                                title: getdata.getTextInputValue("welTitle"),
                                message: getdata.getTextInputValue("welMsg")
                            }
                        }).save().then(async () => {
                            await submit.deferReply({ ephemeral: true })
                            return submit.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ Welcome Message have been updated!`).setColor("Green").setFooter({ text: `The welcome system is actually Disabled! use the command enable-system to enable it!` })] })
                        })
                    } else {
                        if (consult.content.title !== getdata.getTextInputValue("welTitle")) {
                            consult.content.title = getdata.getTextInputValue("welTitle")
                        }
                        if (consult.content.message !== getdata.getTextInputValue("welMsg")) {
                            consult.content.message = getdata.getTextInputValue("welMsg")
                        }
                        await welcomeSchema.findOneAndUpdate({ guildId: submit.guild.id }, { content: consult.content }, { new: true })
                        let testing = await welcomeSchema.findOne({ guildId: submit.guild.id })
                        await submit.deferReply({})
                        submit.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ The Welcome Message have been updated!`).setColor("Green").setDescription(`Preview:\n\n${testing.content.title}\n\n${testing.content.message}`.replace("{guild}", submit.guild.name).replace("{member}", submit.user).replace("{count}", submit.guild.memberCount)).setFooter({ text: `${testing.isEnabled == false ? `❌ The Welcome System is disabled` : `✔ The Welcome System is enabled!`}` })] })
                    }
                }
                break;
            case "set-image":
                consult = await welcomeSchema.findOne({ guildId: interaction.guild.id })
                var getBankGuild = await client.guilds.fetch(guildBank.guild);
                var getChannelBank = await getBankGuild.channels.cache.get(guildBank.channel)
                if (imageTarget) {
                    if (imageTarget.contentType !== "image/png" && imageTarget.contentType !== "image/jpg") return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`I allow static images only...`)], ephemeral: true })
                    if (imageTarget.height > 1080 || imageTarget.width > 1920) return interaction.reply({ content: `The image shouldn't be more bigger than that resolution! (1920x1080)`, ephemeral: true })
                    var sendMsg;
                    if (!consult) {
                        sendMsg = await getChannelBank.send({ content: `${interaction.guild.id}`, files: [{ attachment: imageTarget.attachment, name: imageTarget.name }] })
                        new welcomeSchema({
                            guildId: interaction.guild.id,
                            content: { imageID: sendMsg.id }
                        }).save()
                        await interaction.deferReply({})
                        return interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ The image have been loaded!`).setColor("Green")] })
                    } else {
                        await interaction.deferReply({})
                        await interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ The image have been updated!`).setColor("Green")] })
                        sendMsg = await getChannelBank.send({ content: `${interaction.guild.id}`, files: [{ attachment: imageTarget.attachment, name: imageTarget.name }] })
                        consult.content.imageID = sendMsg.id
                        await welcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { content: consult.content }, { new: true })
                    }
                } else {
                    if (!consult) {
                        return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`❌ Send an image to register to my system!`)], ephemeral: true })
                    } else {
                        var getMsg = await getChannelBank.messages.fetch(consult.content.imageID)
                        try {
                            getMsg.delete()
                            consult.content.imageID = "0"
                            await welcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { content: consult.content }, { new: true })
                            await interaction.deferReply({})
                            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ The Welcome Image have been deleted!`)] })
                        } catch (e) {
                            consult.content.imageID = "0"
                            await welcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { content: consult.content }, { new: true })
                            await interaction.deferReply({})
                            interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`✔ The Welcome Image have been deleted!`)] })
                        }
                    }
                }
                break;
        }
    }
}