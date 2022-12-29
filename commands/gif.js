const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('gif').setDescription('Reply with gif')
        .addStringOption((option) => option
            .setName('keyword')
            .setDescription('Input gif key word')
            .setRequired(true))
};
