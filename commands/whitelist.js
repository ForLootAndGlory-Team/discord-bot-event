const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('whitelist').setDescription('Reply with Character Embed')
        .addNumberOption((option) => option
            .setName('id')
            .setDescription('Input CharacterId')
            .setRequired(true))
            
};