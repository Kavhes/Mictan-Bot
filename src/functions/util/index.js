const { Client, Message, ChannelType, EmbedBuilder, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const { GameDig } = require("gamedig");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
    /**
     * deploy slash commands
     * @param {Client} client the discord.js client instance 
     */
    async deployCommands(client) {
        const commands = [];

        fs.readdirSync(`./commands/slash`).forEach(dir => {
            const commandFiles = fs.readdirSync(`./commands/slash/${dir}/`).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../commands/slash/${dir}/${file}`);
                commands.push(command.data.toJSON());
            }
        });
        const rest = new REST({ version: "10" }).setToken(client.token);

        try {
            await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
            console.log(`slash commands registered successfully for everyone !!`);
        } catch (error) {
            console.log(`failed to register slash commands.`, " error: ".yellow, error);
        };
        return { commands: commands, client: client }
    },
    /**
     * converts seconds to HH:MM:SS
     * @param {Number} d seconds
     */
    secondsToHms(d) {
        d = parseInt(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay = h > 0 ? h + ":" : "";
        let mDisplay = m > 0 ? (m < 10 && h > 0 ? "0" : "") + m + ":" : "00:";
        let sDisplay = s > 0 ? (s < 10 ? "0" : "") + s : "00";
        return hDisplay + mDisplay + sDisplay;
    },
}