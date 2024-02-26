const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "interaction",
    data: new SlashCommandBuilder()
        .setName("binary")
        .setDescription("Make your text encode or decode")
        .addStringOption(option =>
            option
                .setName("function")
                .setDescription("Between enconde or decode the text!")
                .addChoices(
                    { name: "Encode", value: "encode" },
                    { name: "Decode", value: "decode" }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Impletent the text to use")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const func = interaction.options.getString("function")
        const texting = interaction.options.getString("text")
        switch (func) {
            case "encode":
                await fetch(`https://api.popcat.xyz/encode?text=${texting.replace(/\s/g, "+")}`).then(response => response.json()).then(async (data) => {
                    await interaction.deferReply()
                    interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`Bynary System`).addFields({ name: "Normal Text", value: `\`\`\`${texting}\`\`\`` }, { name: "Encoded Text", value: `\`\`\`${data.binary}\`\`\`` }).setColor("Green")] })
                }).catch(err => { console.log(err) })
                break;
            case "decode":
                await fetch(`https://api.popcat.xyz/decode?binary=${texting.replace(/\s/g, "+")}`).then(response => response.json()).then(async (data) => {
                    await interaction.deferReply()
                    interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`Bynary System`).addFields({ name: "Encoded Text", value: `\`\`\`${texting}\`\`\`` }, { name: "Decoded Text", value: `\`\`\`${data.text}\`\`\`` }).setColor("Green")] })
                }).catch(err => { console.log(err) })
                break;
        }
    }
}