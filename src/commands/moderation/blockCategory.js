const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const panels = require('../../models/blockCategory');

module.exports = {
    permissions: [PermissionFlagsBits.ManageMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName("ignore-category")
        .setDescription("Ignore a category of my commands!")
        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("Choose one of the categories to block! (leave it in blank to see the blocked categories)")
                .addChoices(
                    { name: "Interaction", value: "interaction" },
                    { name: "Miscellaneous", value: "misc" },
                    { name: "Moderation", value: "moderation" },
                    { name: "Music", value: "music" },
                    { name: "Utility", value: "utility" }
                )
        ),
    async run(client, interaction) {
        let chose = interaction.options.getString("category")
        let pan = await panels.findOne({ guildId: interaction.guild.id })
        if (chose) {
            if (!pan) {
                new panels({
                    guildId: interaction.guild.id,
                    blocked: [{
                        category: chose
                    }]
                }).save()
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`The category \`${chose}\` have been ignored!`)] })
            }
            if (!pan.blocked.some(v => v.category == chose)) {
                pan.blocked({ category: chose })
                await panels.findOneAndUpdate({ guildId: interaction.guild.id }, { blocked: pan.blocked })
                await interaction.deferReply({ ephemeral: true })
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Ignore Category`)
                            .setDescription(`The category \`${chose}\` have been ignored!`)
                            .setColor("Green")
                    ]
                })
            } else {
                pan.blocked = pan.blocked.filter((v) => v.category !== chose)
                await panels.findOneAndUpdate({ guildId: interaction.guild.id }, { blocked: pan.blocked })
                await interaction.deferReply({ ephemeral: true })
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Ignore Category`)
                            .setDescription(`The category \`${chose}\` have been recognized!`)
                            .setColor("Green")
                    ]
                })
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`${client.user.username}'s Blocked Categories`)
                .setColor("Red")
                .addFields(
                    { name: "💬 Context", value: `${!pan || pan.blocked.some(v => v.category == "context") ? "❌ Blocked" : "✅ Unblocked"}`, inline: true },
                    { name: "🦦 Interaction", value: `${!pan || pan.blocked.some(v => v.category == "inetraction") ? "❌ Blocked" : "✅ Unblocked"}`, inline: true },
                    { name: "#️⃣ Misc", value: `${!pan || pan.blocked.some(v => v.category == "misc") ? "❌ Blocked" : "✅ Unblocked"}`, inline: true },
                    { name: "👮‍♂️ Moderation", value: `${!pan || pan.blocked.some(v => v.category == "moderation") ? "❌ Blocked" : "✅ Unblocked"}`, inline: true },
                    { name: "🎶 Music", value: `${!pan || pan.blocked.some(v => v.category == "music") ? "❌ Blocked" : "✅ Unblocked"}`, inline: true },
                    { name: "🧡 Utility", value: `${!pan || pan.blocked.some(v => v.category == "utility") ? "❌ Blocked" : "✅ Unblocked"}`, inline: true },
                )
                .setFooter({ text: `If a category is blocked. The administrators can use the commands`, iconURL: client.user.displayAvatarURL() })

            interaction.reply({ embeds: [embed] })
        }
    }
}