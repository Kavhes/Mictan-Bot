const fs = require("node:fs");
const colors = require("colors");

module.exports = async (client) => {

    let events = 0;
    let loaded = 0;
    let failed = 0;

    fs.readdirSync(`./events/discord`).forEach(async dir => {
        const eventFiles = fs.readdirSync(`./events/discord/${dir}/`).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`../../events/discord/${dir}/${file}`);
            events++
            if (event) {
                loaded++
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(client, ...args));
                } else {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                }
            } else failed++
        }
    });
    if (failed !== 0) console.log(colors.grey(`・Failed to load ${failed} events`));
    console.log(colors.bold(`・Loaded ` + colors.bold.bgBlack(`${loaded}/${events}`) + ` events ` + colors.bold.brightMagenta(`♡`)));
}