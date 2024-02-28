const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    category: "misc",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Test the ping response!"),
    async run(client, interaction) {
        interaction.reply({ embeds: [new EmbedBuilder().setTitle("🌐 Ping Testing").setDescription(`Testing...`).setColor("Random")] })
        setTimeout(() => {
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`🌐 Ping Testing!`).setDescription(`\`\`\`🤖 My Ping: ${Date.now() - interaction.createdTimestamp}ms\n😶 API: ${Math.round(client.ws.ping)}ms\`\`\``)] })
        }, 3000);
    }
}