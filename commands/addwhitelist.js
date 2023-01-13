const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('addwhitelist').setDescription('add whitelist to testnet')
    .addStringOption((option) => option
            .setName('address')
            .setDescription('Input address to whitelist')
            .setRequired(true))
};