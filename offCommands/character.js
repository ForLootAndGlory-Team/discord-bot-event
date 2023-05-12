const { SlashCommandBuilder } = require('discord.js');
const { EmbedCharacter } = require('../helper/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('character').setDescription('Reply with Character Embed')
        .addNumberOption((option) => option
            .setName('id')
            .setDescription('Input CharacterId')
            .setRequired(true)),
    async execute(interaction) {
        let characterId = interaction.options.getNumber('id');
        try {

            let data = await EmbedCharacter(`Character Infos : #${characterId}`, characterId)
            await interaction.reply({ ephemeral: true, embeds: [data.Embed], files: [data.image] });
        } catch (e) {
        }
    }

};