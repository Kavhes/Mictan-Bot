const fs = require("node:fs");
const colors = require("colors");

module.exports = (client) => {

    let commands = 0;
    let loaded = 0;
    let failed = 0;

    fs.readdirSync(`./commands/slash`).forEach(dir => {
        const commandFiles = fs.readdirSync(`./commands/slash/${dir}/`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../../commands/slash/${dir}/${file}`);
            commands++
            if (command.data.name) {
                client.slash.set(command.data.name, command)
                loaded++
            } else failed++
        }
    });
    if (failed !== 0) console.log(colors.grey(`・Failed to load ${failed} slash commands`));
    console.log(colors.bold(`・Loaded ` + colors.bold.bgBlack(`${loaded}/${commands}`) + ` slash commands ` + colors.bold.brightMagenta(`♡`)));
}