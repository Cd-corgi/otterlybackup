const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const Discord = require('discord.js');
const { ownerID } = require('../../config/config.json')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    category: "misc",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Check the commands of the bot and other things!"),
    async run(client, interaction) {
        let allCmds = Array.from(client.commands.values()); let owner = interaction.guild.members.cache.get(ownerID)
        let commands = []; let cat = ["context", "interaction", "misc", "moderation", "music", "utility"]
        allCmds.map((v, idx) => { commands.push({ name: v.data.name, description: v.data.description, category: v.category }) })
        let commandsXthing = []; let list = []; let emoji = ["💬", "🤖", "#️⃣", "👮‍♂️", "🎶", "🎨"]; let desc = ["Some context Commands", "Some interactive commands", "Some other functional commands", "Moderate the guild with auto-mod and basic mod commands", "Listen music from Spotify and Radio", "Customizate the server with some funny commands!"]; let emojiRef = 0
        cat.forEach((v) => { let si = commands.filter(d => d.category == v); let cc = []; for (const cmd of si) { cc.push(`${cmd.name}`) }; list.push({ category: v, emoji: emoji[emojiRef], description: desc[emojiRef] }); commandsXthing.push({ category: v, commands: cc.join(", ") }); emojiRef++ })
        const menu = new StringSelectMenuBuilder().setCustomId("menu").setPlaceholder("Explore my functions!").addOptions({ value: "home", label: "Home Page", emoji: "🏠", description: `Return to the landing Page!` })
        for (let i = 0; i < list.length; i++) { menu.addOptions({ value: list[i].category, label: list[i].category, emoji: list[i].emoji, description: list[i].description }) }
        const row = new ActionRowBuilder().addComponents(menu)
        const homePage = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setImage("https://cdn.discordapp.com/attachments/936271538196451379/1028764687082459236/lide-radio.png").setThumbnail(client.user.displayAvatarURL()).setDescription(`Welcome to my Help Menu! Try to explore my commands on here, and make sure what do you want to use 🦦`).setColor("Random").addFields({ name: "Server Count", value: `🟢 \`${client.guilds.cache.size}\` Guilds`, inline: true }, { name: "Commands Count", value: `🔨 \`${client.commands.size}\` Commands`, inline: true }, { name: "Owner", value: `${owner.user.tag}`, inline: true })
        row.components[0].addOptions({ label: "Close Menu", emoji: "❌", value: "close", description: "Close the help menu" })
        let msg = await interaction.reply({ embeds: [homePage], components: [row] })
        let filter = (i) => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, componentType: Discord.ComponentType.StringSelect })
        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) return interaction.reply({ content: `You can't interact with this menu!`, ephemeral: true });
            switch (i.values[0]) {
                case "home": await i?.deferUpdate(); i.editReply({ embeds: [homePage], components: [row] }); collector.resetTimer(); break;
                case "misc": await i?.deferUpdate(); let miscmd = commandsXthing.filter(v => v.category == "misc"); const membed = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setThumbnail(client.user.displayAvatarURL()).addFields({ name: '**Misc Commands**', value: `${miscmd[0].commands.length < 1 ? '\`No commands yet\`' : `\`\`\`${miscmd[0].commands}\`\`\``}` }); i.editReply({ embeds: [membed], components: [row] }); collector.resetTimer(); break;
                case "interaction": await i?.deferUpdate(); let intcmd = commandsXthing.filter(v => v.category == "interaction"); const iembed = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setThumbnail(client.user.displayAvatarURL()).addFields({ name: '**Interaction Commands**', value: `${intcmd[0].commands.length < 1 ? '\`No commands yet\`' : `\`\`\`${intcmd[0].commands}\`\`\``}` }); i.editReply({ embeds: [iembed], components: [row] }); collector.resetTimer(); break;
                case "moderation": await i?.deferUpdate(); let modcmd = commandsXthing.filter(v => v.category == "moderation"); const modembed = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setThumbnail(client.user.displayAvatarURL()).addFields({ name: '**Moderation Commands**', value: `${modcmd[0].commands.length < 1 ? '\`No commands yet\`' : `\`\`\`${modcmd[0].commands}\`\`\``}` }); i.editReply({ embeds: [modembed], components: [row] }); collector.resetTimer(); break;
                case "context": await i?.deferUpdate(); let contextcmd = commandsXthing.filter(v => v.category == "context"); const cembed = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setThumbnail(client.user.displayAvatarURL()).addFields({ name: '**Context Commands**', value: `${contextcmd[0].commands.length < 1 ? '\`No commands yet\`' : `\`\`\`${contextcmd[0].commands}\`\`\``}` }); i.editReply({ embeds: [cembed], components: [row] }); collector.resetTimer(); break;
                case "music": await i?.deferUpdate(); let msccmd = commandsXthing.filter(v => v.category == "music"); const muembed = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setThumbnail(client.user.displayAvatarURL()).addFields({ name: '**Music Commands**', value: `${msccmd[0].commands.length < 1 ? '\`No commands yet\`' : `\`\`\`${msccmd[0].commands}\`\`\``}` }); i.editReply({ embeds: [muembed], components: [row] }); collector.resetTimer(); break;
                case "utility": await i?.deferUpdate(); let utilcmd = commandsXthing.filter(v => v.category == "utility"); const uembed = new EmbedBuilder().setTitle(`${client.user.username.endsWith("s") ? `${client.user.username}'` : `${client.user.username}'s`} Help Menu`).setThumbnail(client.user.displayAvatarURL()).addFields({ name: '**Utility Commands**', value: `${utilcmd[0].commands.length < 1 ? '\`No commands yet\`' : `\`\`\`${utilcmd[0].commands}\`\`\``}` }); i.editReply({ embeds: [uembed], components: [row] }); collector.resetTimer(); break; case "close": collector.stop(); await i?.deferUpdate(); i.deleteReply().catch(err => { }); break;
            }
        })
        collector.on("end", async (collected) => { if (collected.size < 1) { row.components[0].setDisabled(true); row.components[0].setPlaceholder("Interaction Timeout") } else { row.components[0].setDisabled(true); row.components[0].setPlaceholder("Interaction Timeout") } interaction.editReply({ components: [row] }) })
    }
}