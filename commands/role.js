const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { uiHost } = require('../const');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Replies with Claim Role URL!'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Claim Role!')
                    .setURL(`${uiHost}/#/claim-role`)
                    .setStyle(ButtonStyle.Link)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ShowModal')
                    .setLabel('Submit')
                    .setStyle(ButtonStyle.Secondary)
            );
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Claim your Role')
            .setURL('https://forlootandglory.io')
            .setDescription('If you are a FLAG Royalty Staker take your role below! Go on your claim role page and generated a signed message to prouve your ownership and grant your role')
            .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });

        await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
    }
};