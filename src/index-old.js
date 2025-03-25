const Discord = require('discord.js');
const Rcon = require('node-rcon');

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
});

// Initialize RCON connection
const conn = new Rcon({
    host: '170.39.212.112',
    port: '2302',
    password: 'stg2024'
});

conn.on('auth', () => {
    console.log('Authenticated with Arma 3 server.');
}).on('response', str => {
    console.log('Got response: ' + str);
}).on('end', () => {
    console.log('Socket closed!');
});

// Connect to the Arma 3 server
conn.connect();

// Listen for Discord messages
bot.on('message', async message => {
    // Ignore messages from other bots
    if(message.author.bot) return;

    // You can add your logic here to handle different commands
    // For example, you could send a command to the Arma 3 server when a certain message is received in Discord
    if(message.content === '!arma') {
        conn.send('your_arma_command');
    }
});

// Login to Discord
bot.login('token');