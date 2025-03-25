const { ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");
const clientMain = require("../../../index");
const wait = require('node:timers/promises').setTimeout;
require("colors");

module.exports = {
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async eventSlashCmds(client, interaction, color) {
        const command = client.slash.get(interaction.commandName);
        const cmdName = interaction.commandName;
        if (!command) return;
        console.log("command ran");
        await command.execute(client, interaction, color);
    }
}