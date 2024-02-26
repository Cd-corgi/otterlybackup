const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    owner: true,
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check the bot's Statistics")
        .setDefaultMemberPermissions(0),
    async run(client, interaction) {
        const clusters = client.cluster;
        const duck = await clusters.fetchClientValues('guilds.cache.size');
        const users = await clusters.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)).then(x => x.reduce((a, b) => a + b, 0));
        const clusterInfo = await clusters.broadcastEval(c => ({
            id: c.cluster.id,
            status: c.cluster.mode,
            guilds: c.guilds.cache.size,
            members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
            ping: c.ws.ping,
        }));
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
        const emee = new EmbedBuilder()
            .setTitle(`${client.user.username}'s Statistics`)
            .setColor("Green")
            .setThumbnail(client.user.displayAvatarURL())
        clusterInfo.forEach(i => {
            const status = i[0] === 'process' ? "❌" : "✅";
            emee.addFields({
                name: `${status} Cluster ${(parseInt(i.id) + 1).toString()}`, value: `\`\`\`
Servers: ${i.guilds.toLocaleString()}
Users: ${i.members.toLocaleString()}
Latency: ${i.ping.toLocaleString()}ms
\`\`\``});
        });
        emee.addFields({
            name: 'Total Details', value: `\`\`\`
Servers: ${duck.reduce((a, b) => a + b)}
Users: ${users}
Clusters: ${clusters.count}
Shards: 2
Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
Latency: ${client.ws.ping}ms
\`\`\``})
        await interaction.deferReply()
        return interaction.followUp({ embeds: [emee] })
    }
}