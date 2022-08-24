const Discord = require('discord.js');
const Fs = require('fs');

const DiscordBot = require('./src/structures/DiscordBot');

createMissingDirectories();

const client = new DiscordBot({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages],
    retryLimit: 2,
    restRequestTimeout: 60000,
    disableEveryone: false
});

client.build();

function createMissingDirectories() {
    if (!Fs.existsSync(`${__dirname}/logs`)) {
        Fs.mkdirSync(`${__dirname}/logs`);
    }

    if (!Fs.existsSync(`${__dirname}/instances`)) {
        Fs.mkdirSync(`${__dirname}/instances`);
    }

    if (!Fs.existsSync(`${__dirname}/credentials`)) {
        Fs.mkdirSync(`${__dirname}/credentials`);
    }

    if (!Fs.existsSync(`${__dirname}/src/resources/images/maps`)) {
        Fs.mkdirSync(`${__dirname}/src/resources/images/maps`);
    }
}

exports.client = client;
