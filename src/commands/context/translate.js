const { ContextMenuCommandBuilder, EmbedBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch')
module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "context",
    data: new ContextMenuCommandBuilder()
        .setName("Translate Text")
        .setType(3),
    async run(client, interaction) {
        const { channel, targetId } = interaction
        let qq = await channel.messages.fetch({ message: targetId })
        let query = qq.content

        const modal = new ModalBuilder()
            .setCustomId("modal-trans")
            .setTitle("Translate")
        const row = new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("language")
                    .setMaxLength(2)
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(true)
                    .setLabel("Provide the Language to translate!")
                    .setPlaceholder("Example: en = English")
            )
        modal.addComponents(row)
        await interaction.showModal(modal)

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id == interaction.user.id
        }).catch(error => {
            console.error;
            return null
        })
        if (submitted) {
            const lang = submitted.fields.getTextInputValue("language")
            await fetch(`https://api.popcat.xyz/translate?to=${lang}&text=${query.replace(/\s/g, "+")}`).then(res => res.json()).then(async (data) => {
                try {
                    await submitted.deferReply({ ephemeral: true })
                    submitted.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Translation`)
                                .addFields(
                                    { name: "Original Text", value: "```" + query + "```" },
                                    { name: "Translated Text", value: "```" + data.translated + "```" }
                                )
                        ]
                    })
                } catch (error) {
                    console.error
                    submitted.reply({ content: error, ephemeral: true })
                }
            })
        }
    }
}