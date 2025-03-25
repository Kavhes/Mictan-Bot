const {
    Client, Events, ActivityType, Collection
} = require("discord.js");
const { deployCommands } = require("../../../functions/util");
const { getArmaServer, armaServerEmbed } = require("../../../functions/util/arma");
const wait = require('node:timers/promises').setTimeout;

let messageId = null, channelId = process.env.CHANNEL_ID;

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        async function clientPresenceLoop() {
            let presenceData = {
                status: "dnd",
                activities: [
                    {
                        name: "😴",
                        type: ActivityType.Custom,
                        url: "https://www.youtube.com/watch?v=WjrgyufSsus"
                    }
                ]
            };
            const info = await getArmaServer().catch(e => { });
            if (info) {
                presenceData.status = "online";
                presenceData.activities[0].name = `${info.map || "no map"}`;
                presenceData.activities[0].type = ActivityType.Competing;
            };
            client.user.setPresence(presenceData);
        };
        async function messageLoop() {
            const info = await getArmaServer().catch(e => { });
            if (info) {
                const embed = armaServerEmbed(info);
                const channel = await client.channels.fetch(channelId).catch(e => { });
                if (channel) {
                    const message = await channel.messages.fetch(messageId).catch(e => { });
                    if (message && message.author) { // update message
                        message.edit({ embeds: [embed] });
                    } else { // create new message
                        const message = await channel.send({ embeds: [embed] });
                        messageId = message.id;
                    }
                }
            }
        }
        
        console.log(client.user?.tag.cyan + ` esta online !!`);
        deployCommands(client);

        clientPresenceLoop();
        messageLoop();

        setInterval(() => {
            clientPresenceLoop();
            messageLoop();
        }, 15 * 1000);
    }
}