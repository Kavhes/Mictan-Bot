const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const { getArmaServer, armaServerEmbed } = require("../../../functions/util/arma");
require("colors");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("arma")
        .setDMPermission(true)
        .setDescription("arma server info"),
    category: "game",

    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        const { user, channel } = interaction;

        try {
            console.log("Ejecutando comando /arma");

            // Obtener la información del servidor de Arma 3
            let info = await getArmaServer().catch(e => {
                console.error("Error obteniendo información del servidor:", e);
                return null;
            });

            // Crear el embed inicial
            const embed = armaServerEmbed(info || null);

            // Enviar el mensaje y obtener el mensaje enviado
            await interaction.reply({ embeds: [embed] });
            console.log("Mensaje enviado correctamente.");

            const message = await interaction.fetchReply().catch(err => {
                console.error("Error obteniendo el mensaje enviado:", err);
                return null;
            });

            if (!message) {
                console.error("No se pudo obtener el mensaje enviado.");
                return;
            }

            console.log("Mensaje obtenido:", message);

            // Guardar los IDs
            const channelId = channel?.id;
            const messageId = message?.id;

            if (!channelId || !messageId) {
                console.error("No se pudieron obtener los IDs del canal o mensaje.");
                return;
            }

            console.log(`Mensaje enviado en canal ID: ${channelId} con mensaje ID: ${messageId}`);

        } catch (error) {
            console.error("Error ejecutando el comando:", error);
            return interaction.reply({ content: "Hubo un error al obtener la información del servidor.", ephemeral: true });
        }
    },
};
