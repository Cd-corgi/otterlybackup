const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const sup = require('../../models/supporter')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    botp: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    inVoiceChannel: true,
    checkLive: true,
    category: "music",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song in the voice channel!")
        .addStringOption(option =>
            option
                .setName("song")
                .setDescription(`Provide the name or URL of the song!`)
                .setRequired(true)
        ),
    async run(client, interaction) {
        const query = interaction.options.getString("song")
        let supporter = await sup.findOne({ userId: interaction.user.id })
        if (supporter && supporter.tier == "uspr" && supporter.expiration == undefined) {
            const player = await client.manager.createPlayer({ guildId: interaction.guild.id, voiceId: interaction.member.voice.channel.id, textId: interaction.channel.id, shardId: interaction.guild.shardId, volume: 100, deaf: true });
            const resolve = await player.search(query, { engine: "youtube" });
            const { loadType, tracks, playlistInfo } = resolve;
            if (loadType == "NO_MATCHES" || !tracks.length) {
                await player.stop()
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`⚠ | No Matches Found`).setColor("Yellow")] })
                return;
            }
            if (loadType == "PLAYLIST_LOADED") {
                for (const track of tracks) { player.queue.add(track, { requester: interaction.user }) }
                if (!player.playing && !player.paused) await player.play();
                await interaction.deferReply()
                return interaction.followUp({ embeds: [new EmbedBuilder().setColor("Random").setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif").setDescription(`Added \`${playlistInfo.name}\``)] }).then(() => setTimeout(() => interaction.deleteReply(), 6000))
            } else if (loadType == "SEARCH_RESULT" || loadType == "TRACK_LOADED") {
                player.queue.add(tracks[0], { requester: interaction.user })
                if (!player.playing && !player.paused) await player.play();
                await interaction.deferReply()
                return interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`💿 Queued Song`).setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif").setDescription(`Queued ${tracks[0].info.title}!`).setColor("Green")] }).then(() => setTimeout(() => interaction.deleteReply(), 6000))
            }
        } else {
            let noYoutube = /(https?:\/\/)?(www.)?((player.vimeo.com\/video\/[0-9]{9})|((youtube.com|youtu\.be)\/))/gm
            if (noYoutube.test(query)) { return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`❌ No Youtube Songs or URL allowed!`)] }) }
            const player = await client.manager.createPlayer({ guildId: interaction.guild.id, voiceId: interaction.member.voice.channel.id, textId: interaction.channel.id, shardId: interaction.guild.shardId, volume: 100, deaf: true });
            const resolve = await player.search(query);
            const { loadType, tracks, playlistInfo } = resolve;
            if (loadType == "NO_MATCHES" || !tracks.length) {
                await player.stop()
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`⚠ | No Matches Found`).setColor("Yellow")] })
                return;
            }
            if (loadType == "PLAYLIST_LOADED") {
                for (const track of tracks) { player.queue.add(track, { requester: interaction.user }) }
                if (!player.playing && !player.paused) await player.play();
                await interaction.deferReply()
                return interaction.followUp({ embeds: [new EmbedBuilder().setColor("Random").setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif").setDescription(`Added \`${playlistInfo.name}\``)] }).then(() => setTimeout(() => interaction.deleteReply(), 6000))
            } else if (loadType == "SEARCH_RESULT" || loadType == "TRACK_LOADED") {
                player.queue.add(tracks[0], { requester: interaction.user })
                if (!player.playing && !player.paused) await player.play();
                await interaction.deferReply()
                return interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`💿 Queued Song`).setThumbnail("https://cdn.discordapp.com/attachments/937085230077071431/969333643342409769/anim-queue.gif").setDescription(`Queued ${tracks[0].info.title}!`).setColor("Green")] }).then(() => setTimeout(() => interaction.deleteReply(), 6000))
            }
        }
    }
}