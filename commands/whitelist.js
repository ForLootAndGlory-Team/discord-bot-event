const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('whitelist').setDescription('Reply with whitelist file')
};