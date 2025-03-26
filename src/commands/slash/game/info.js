const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const { getArmaServer, armaServerEmbed } = require("../../../functions/util/arma");
require("colors");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("arma")
        .setDMPermission(false) // Evita que el comando se use en DMs
        .setDescription("arma server info"),
    category: "game",

    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        const { channel, guildId } = interaction;

        if (!guildId) {
            return interaction.reply({ content: "❌ Este comando solo puede usarse en servidores.", ephemeral: true });
        }

        try {
            console.log("Ejecutando comando /arma");

            // Obtener la información del servidor de Arma 3
            let info = await getArmaServer().catch(e => {
                console.error("Error obteniendo información del servidor:", e);
                return null;
            });

            // Crear el embed inicial
            let embed = armaServerEmbed(info || null);

            // Enviar el mensaje y obtener el mensaje enviado
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            console.log("Mensaje enviado correctamente.");

            // Iniciar la actualización automática cada 30 segundos
            setInterval(async () => {
                console.log("Actualizando mensaje...");
                let updatedInfo = await getArmaServer().catch(e => {
                    console.error("Error obteniendo actualización del servidor:", e);
                    return null;
                });
                let updatedEmbed = armaServerEmbed(updatedInfo || null);
                await message.edit({ embeds: [updatedEmbed] }).catch(err => {
                    console.error("Error actualizando el mensaje:", err);
                });
            }, 1000); // Actualiza cada 30 segundos

        } catch (error) {
            console.error("Error ejecutando el comando:", error);
            return interaction.reply({ content: "Hubo un error al obtener la información del servidor.", ephemeral: true });
        }
    },
};
