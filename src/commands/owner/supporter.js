const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const spSchema = require('../../models/supporter')
const mmt = require('moment')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    owner: true,
    data: new SlashCommandBuilder()
        .setName("supporter")
        .setDescription("Manage the supporter members")
        .setDefaultMemberPermissions(0)
        .addSubcommand(option =>
            option
                .setName("add-user")
                .setDescription("Add an user to the Supporter Club")
                .addStringOption(option =>
                    option
                        .setName("user-id")
                        .setDescription("Provide the user's ID to add")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("role")
                        .setDescription(`Define what Supporter level you want to add to the user`)
                        .addChoices(
                            { name: "Supporter", value: `spr1` },
                            { name: "Supporter +", value: `spr2` },
                            { name: "Supporter ++", value: `sp3` },
                            { name: "Unique", value: `uspr` },
                        )
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("duration")
                        .setDescription("Apply a duration of the supporter tier")
                        .addChoices(
                            { name: "7 Days", value: "7d" },
                            { name: "1 Month", value: "1m" },
                            { name: "3 Month", value: "3m" },
                            { name: "1 Year", value: "1y" },
                            { name: "Permanent", value: "per" },
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(option =>
            option
                .setName("remove-user")
                .setDescription("Remove an user from the Supporter Tiers")
                .addStringOption(option =>
                    option
                        .setName("user-id")
                        .setDescription("Provide the user to remove the supporter tier")
                        .setRequired(true)
                )
        )
        .addSubcommand(option =>
            option
                .setName("list")
                .setDescription("Show the people joined in the supporters tiers!")
        ),
    async run(client, interaction) {
        const sb = interaction.options.getSubcommand()
        const time = interaction.options.getString("duration")
        const rr = interaction.options.getString("role")
        const userid = interaction.options.getString("user-id")
        switch (sb) {
            case "add-user":
                let mem = await interaction.guild.members.cache.get(userid)
                if (mem == undefined || mem == null) return interaction.reply({ content: `Invalid ID User or the inserted user is not in none of the servers where i am joined!`, ephemeral: true })
                let sp = await spSchema.findOne({ userId: mem.user.id })
                if (!sp) {
                    if (time !== "per") {
                        let today = mmt(new Date())
                        if (time == "7d") {
                            today.add(7, 'days')
                        } else if (time == "1m") {
                            today.add(1, 'month')
                            today.add(1, "day")
                        } else if (time == "3m") {
                            today.add(3, 'months')
                            today.add(1, "day")
                        } else if (time == "1y") {
                            today.add(1, 'year')
                            today.add(1, "day")
                        }
                        new spSchema({
                            userId: mem.user.id,
                            tier: rr,
                            expiration: `${today.toDate().toJSON().slice(0, 10)}`
                        }).save().then(() => {
                            console.log(`[⭐ Supporter] ${mem.user.tag} Have been Added as ${rr}`)
                        })
                        await interaction.deferReply({ ephemeral: true })
                        interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`⭐ Support System`).setDescription(`The user **${mem.user.tag}** have been joined to the supporter team as ${rr}`)] })
                        try {
                            mem.send(`⭐ **Supporter System**\nYou are now a supporter of \`${client.user.username}\``)
                        } catch (error) { }
                    } else {
                        new spSchema({
                            userId: mem.user.id,
                            tier: rr,
                        }).save().then(() => {
                            console.log(`[⭐ Supporter] ${mem.user.tag} Have been Added as ${rr}\x1b[33m Permanently\x1b[0m!`)
                        })
                        await interaction.deferReply({ ephemeral: true })
                        interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`⭐ Support System`).setDescription(`The user **${mem.user.tag}** have been joined to the supporter team as ${rr}`)] })
                        try {
                            mem.send(`⭐ **Supporter System**\nYou are now a supporter of \`${client.user.username}\``)
                        } catch (error) { }

                    }
                } else return interaction.reply({ content: `The provided user is a supporter already ^^`, ephemeral: true })
                break;
            case "remove-user":

                break;
            case "list":

                break;
        }
    }
}