const Discord = require('discord.js');
const { token, ID, nodes, TOKENS } = require('./src/config/config.json')
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');
const client = new Discord.Client({ intents: [3276543], partials: [Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message], shards: getInfo().SHARD_LIST, shardCount: getInfo().TOTAL_SHARDS, });
const fs = require('fs');
const { FerraLink } = require('ferra-link');
const { Connectors } = require('shoukaku');
require(`./src/utils/mongoose`)();

process.on('unhandledRejection', error => { console.error("\x1b[41m", `[UNHANDLED ALARM] ${error}`, "\x1b[0m"); console.log(error) });
client.on('shardError', error => { console.error(`[SHARD ALARM] ${error}`); console.log(error) });

client.commands = new Discord.Collection(); client.cluster = new ClusterClient(client); client.category = new Discord.Collection(); client.category = new Discord.Collection()

client.manager = new FerraLink({
    client, nodes,
    shoukakuoptions: TOKENS.shoukakuOptions,
    defaultSearchEngine: "Spotify",
    spotify: [{ ClientID: TOKENS.spotifyPlugin.clientID, ClientSecret: TOKENS.spotifyPlugin.secretClient }],
    send: (guildId, payload) => { const guild = client.guilds.cache.get(guildId); if (guild) guild.shard.send(payload) }
}, new Connectors.DiscordJS(client));
const ferralink = client.manager;

fs.readdir("./src/events/FerraLink", (err, files) => { if (err) console.error; files.forEach((file) => { if (!file.endsWith(".js")) return; let eName = file.split(".")[0]; const events = require(`./src/events/FerraLink/${file}`); ferralink.shoukaku.on(eName, events.bind(null, client)); console.log(`[FERRALINK-EVENTS] ${eName} Loaded`); }) });
fs.readdir("./src/events/FerraLink/Music", (err, files) => { if (err) console.error; files.forEach((file) => { if (!file.endsWith(".js")) return; let eName = file.split(".")[0]; const events = require(`./src/events/FerraLink/Music/${file}`); ferralink.on(eName, events.bind(null, client)); console.log(`[FERRALINK] ${eName} Loaded`); }) });
fs.readdir("./src/events/client", (err, file) => { if (err) console.log(err); file.forEach((f) => { if (!f.endsWith(".js")) return; let eName = f.split(".")[0]; const events = require(`./src/events/client/${f}`); client.on(eName, events.bind(null, client)); console.log(`$ [Events] - ${eName} Loaded!`) }); })
fs.readdirSync("./src/commands").forEach(category => { const comm = fs.readdirSync(`./src/commands/${category}`).filter((f) => f.endsWith(".js")); for (const command of comm) { let cmdFile = require(`./src/commands/${category}/${command}`); client.commands.set(cmdFile.data.name, cmdFile) } })

loadDash(token, ID);
client.login(token).then(() => console.log(client.user.tag + " Logged In!"))

function loadDash(tk, bid) {
    var cmds = [];
    fs.readdirSync("./src/commands").forEach(category => {
        const comm = fs.readdirSync(`./src/commands/${category}`).filter(f => f.endsWith(".js")); for (const command of comm) { let commandFile = require(`./src/commands/${category}/${command}`); cmds.push(commandFile.data.toJSON()) }
    }); const rest = new Discord.REST({ version: "10" }).setToken(tk);
    Slash();
    async function Slash() {
        try {
            rest.put(Discord.Routes.applicationCommands(bid), { body: cmds });
            console.log(cmds.length + " Commands Loaded")
        } catch (error) { console.log(error) }
    }
}
