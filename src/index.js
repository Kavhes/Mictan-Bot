const { Client, Collection, GatewayIntentBits, Partials, Options } = require("discord.js");
const fs = require("node:fs");
const crypto = require("crypto");
const dotenv = require("dotenv").config();

function sessionToken() {
    return crypto.randomBytes(16).toString("base64url");
};
const client = new Client({
    intents: [
        GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, 
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.GuildMember, Partials.User, Partials.Message, Partials.Channel],
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: true
    },
    failIfNotExists: false,
    sweepers: {
        ...Options.DefaultSweeperSettings,
		messages: {
			interval: 3_600, // Every hour.
			lifetime: 1_800, // Remove messages older than 30 minutes.
		},
    }
});

client.setMaxListeners(0);

client.slash = new Collection();

const cid = sessionToken();
client.cid = cid;
module.exports = client;

fs.readdirSync(`./handlers`).forEach(dir => {
    const files = fs.readdirSync(`./handlers/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of files) {
        require(`./handlers/${dir}/${file}`)(client);
    }
});
client.login(process.env.BOT_TOKEN);

// error handler
process.on("unhandledRejection", async (reason, p) => {
    console.log(reason, p);
});
process.on("uncaughtException", async (error, origin) => {
    console.log(error, origin);
});
process.on("uncaughtExceptionMonitor", async (error, origin) => {
    console.log(error, origin);
});