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
            await interaction.reply({ embeds: [embed] });
            const message = await interaction.fetchReply(); // Obtener el mensaje después de responder
            console.log("Mensaje enviado correctamente.");

            setInterval(async () => {
                console.log("Actualizando mensaje...");
                try {
                    let updatedInfo = await getArmaServer().catch(e => {
                        console.error("Error obteniendo actualización del servidor:", e);
                        return null;
                    });
            
                    let updatedEmbed = armaServerEmbed(updatedInfo || null);
            
                    // Intentar obtener el canal de nuevo
                    const channel = await client.channels.fetch(interaction.channelId).catch(() => null);
                    if (!channel) {
                        console.error("❌ Error: El bot no puede acceder al canal o ha sido eliminado.");
                        return;
                    }
            
                    // Verificar que el bot tiene permisos para ver y editar mensajes en el canal
                    const botPermissions = channel.permissionsFor(client.user.id);
                    
                    if (!botPermissions.has("ViewChannel") || !botPermissions.has("SendMessages") || !botPermissions.has("ReadMessageHistory")) {
                        console.error("❌ Error: El bot no tiene permisos suficientes en el canal.");
                        return;
                    }
            
                    // Obtener el mensaje original
                    const fetchedMessage = await channel.messages.fetch(message.id).catch(() => null);
                    if (!fetchedMessage) {
                        console.error("❌ Error: No se pudo obtener el mensaje original.");
                        return;
                    }
            
                    await fetchedMessage.edit({ embeds: [updatedEmbed] }).catch(err => {
                        console.error("Error actualizando el mensaje:", err);
                    });
            
                } catch (err) {
                    console.error("❌ Error en la actualización del mensaje:", err);
                }
            }, 1000); // Actualiza cada 30 segundos

        } catch (error) {
            console.error("Error ejecutando el comando:", error);
            return interaction.reply({ content: "Hubo un error al obtener la información del servidor.", ephemeral: true });
        }
    },
};
