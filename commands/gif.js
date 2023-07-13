const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('gif').setDescription('Reply with gif')
        .addStringOption((option) => option
            .setName('keyword')
            .setDescription('Input gif key word')
            .setRequired(true)),
    async execute(interaction) {
        try {
            let keyword = interaction.options.getString('keyword')
            let url = `https://tenor.googleapis.com/v2/search?q=${keyword}&key=${process.env.TENOR_API}&limit=10`
            let response = await fetch(url)
            let result = await response.json()
            let index = Math.floor(Math.random() * result.results.length)
            await interaction.deferReply(result.results[index].url)
        } catch (error) {
            console.log(error)
        }
    }
};
