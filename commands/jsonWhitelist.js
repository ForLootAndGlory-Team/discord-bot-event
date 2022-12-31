const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('jsonwhitelist').setDescription('Reply with Character Embed')
};