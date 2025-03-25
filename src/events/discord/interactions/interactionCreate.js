const {
    Client, ChatInputCommandInteraction, Events, ModalSubmitInteraction, AutocompleteInteraction, ChannelType
} = require("discord.js");
const { eventSlashCmds } = require("../../../functions/events/commands/slash");
const wait = require('node:timers/promises').setTimeout;
require("colors");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {ChatInputCommandInteraction | ModalSubmitInteraction | AutocompleteInteraction} interaction 
     * @param {Client} client 
     */
    async execute(client, interaction) {

        const { channel, guild, id, member, user } = interaction;

        let color = Number(`0x${process.env.COLOR}`);

        if (interaction.isChatInputCommand()) {
            eventSlashCmds(client, interaction, color).catch(error => { });

        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slash.get(interaction.commandName);
            if (!command) return;
            await command.autocomplete(client, interaction, color);
        }
    },
};