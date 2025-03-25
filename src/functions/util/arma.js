const { Client, Message, ChannelType, EmbedBuilder, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const { GameDig } = require("gamedig");
const { secondsToHms } = require("./index");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
    /**
     * get arma server info
     * @returns 
     */
    async getArmaServer() {
        const info = await GameDig.query({
            type: "arma3",
            host: process.env.ARMA_IP,
            port: process.env.ARMA_PORT
        });
        return info;
    },
    /**
     * generate a player list text/string
     * @param {Object} info server info object
     */
    getPlayersText(info) {
        const players = `\`${info.numplayers}/${info.maxplayers}\``
            + `\n\`\`\`js\n${info.players.map(p => `\n- ${p.name} (${secondsToHms(p.raw.time)})\nscore: ${p.raw.score}`).join("\n\n")}\n\`\`\``;
        return players;
    },
    /**
     * form a discord embed object for the arma server stats
     * @param {Object} info server info object
     */
    armaServerEmbed(info) {
        let embed;
        if (info) {
            let players;
            try {
                players = `\`${info.numplayers}/${info.maxplayers}\``
                    + `\n\`\`\`js\n${info.players.map(p => `\n- ${p.name} (${secondsToHms(p.raw.time)})\nscore: ${p.raw.score}`).join("\n\n")}\n\`\`\``;
            } catch (error) {
                console.error(error)
            }
            embed = new EmbedBuilder()
                .setTitle(info.name)
                .setFields([
                    {
                        name: `estado`,
                        value: `online`,
                        inline: true
                    },
                    {
                        name: `ping`,
                        value: `${info.ping || "0"}`,
                        inline: true
                    },
                    {
                        name: `mapa`,
                        value: `${info.map || "no map"}`,
                        inline: true
                    },
                    {
                        name: `jugadores`,
                        value: players || "no players",
                        inline: true
                    }
                ])
                .setColor("#85dd86")
                ;
        } else {
            embed = new EmbedBuilder()
                .setTitle("server offline")
                .setDescription(`${member.displayName}, no pude conectar con el servidor`)
                .setFields({
                    name: `estado`,
                    value: `offline`
                })
                .setColor("#da5454")
                ;
        }
        return embed;
    }
}