const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    btop: [PermissionFlagsBits.Connect, PermissionFlagsBits.SendMessages],
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName("radio")
        .setDescription("📻 Select a Radio Station to play in 24/7")
        .addStringOption(option =>
            option
                .setName("station")
                .setDescription("🎶 Select your Radio Station!")
                .setRequired(true)
                .addChoices(
                    { name: "70's Hits", value: "radio70" },
                    { name: "80's Hits", value: "radio80" },
                    { name: "90's Hits", value: "radio90" },
                    { name: "Top #40 Hits Pop", value: "t40" },
                    { name: "R&B Hits", value: "rbhits" },
                    { name: "Classic Rock", value: "crock" },
                    { name: "Dubstep", value: "dubstep" },
                    { name: "LoFi", value: "lofi" },
                    { name: "Japanese Radio", value: "jp" },
                    { name: "Rap Radio", value: "rap" }
                )
        ),
    async run(client, interaction) {
        const radio = interaction.options.getString("station")
        let ppExist = client.manager.players.get(interaction.guild.id)
        let rurl = "";
        switch (radio) {
            case "radio70":
                rurl = "http://radio.idjstream.com:15018/stream";
                break;
            case "radio80":
                rurl = "http://radio.idjstream.com:15020/stream";
                break;
            case "radio90":
                rurl = "http://radio.idjstream.com:15022/stream";
                break;
            case "t40":
                rurl = "http://radio.idjstream.com:15006/stream";
                break;
            case "rbhits":
                rurl = "http://radio.idjstream.com:15008/stream";
                break;
            case "crock":
                rurl = "http://radio.idjstream.com:15012/stream";
                break;
            case "dubstep":
                rurl = "http://radio.idjstream.com:15030/stream";
                break;
            case "lofi":
                rurl = "http://stream.dar.fm/154980"
                break;
            case "jp":
                rurl = "https://audio.misproductions.com/japan128k"
                break;
            case "rap":
                rurl = "http://stream.dar.fm/141073"
                break;
        }
        await interaction.deferReply()
        if (ppExist) {
            ppExist.loop = "none"
            ppExist.queue.clear()
            const res = await ppExist.search(rurl)
            const { loadType, tracks, playlistinfo } = res
            for (const track of tracks) {
                ppExist.queue.add(track, { requester: interaction.user })
            }
            ppExist.skip()
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Radio Mode")
                        .setDescription(`Plyaing the station ${radio}`)
                        .setColor("Green")
                ]
            }).then(() => setTimeout(() => interaction.deleteReply(), 5000))
        } else {
            const player = await client.manager.createPlayer({ guildId: interaction.guild.id, voiceId: interaction.member.voice.channel.id, textId: interaction.channel.id, shardId: interaction.guild.shardId, volume: 100, deaf: true });
            const resolve = await player.search(rurl)
            const { loadType, tracks, playlistinfo } = resolve
            for (const track of tracks) {
                player.queue.add(track, { requester: interaction.user })
                if (player.playing) {
                    player.loop = "none"
                    player.skip()
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Radio Mode")
                                .setDescription(`Plyaing the station ${radio}`)
                                .setColor("Green")
                        ]
                    }).then(() => setTimeout(() => interaction.deleteReply(), 5000))
                } else {
                    player.play()
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Radio Mode")
                                .setDescription(`Plyaing the station ${radio}`)
                                .setColor("Green")
                        ]
                    }).then(() => setTimeout(() => interaction.deleteReply(), 5000))
                }
            }

        }

    }
}