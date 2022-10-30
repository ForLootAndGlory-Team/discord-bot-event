require('dotenv').config();
const abi = require("./abi.json");
const RoyaltyABI = require("./RoyaltyABI.json");
const { rpcURL, botHost, uiHost } = require('./const')
const ethers = require('ethers');
const Web3 = require("web3");
const express = require('express');
const { port, guildId } = require('./config.json');
const app = express();
const wait = require('node:timers/promises').setTimeout;
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(rpcURL)
);
const { Client, GatewayIntentBits, EmbedBuilder, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const network = {
    name: "polygon",
    chainId: 137,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(rpcURL)
};
const provider = ethers.getDefaultProvider(network);

const scholarship = new ethers.Contract('0x174611Fa14d1cb4038F221E33Dcc446F39DDEf22', abi, provider);
const royalty = new ethers.Contract('0x702cEC12BF55C58fb6dE889fac8A875964E5dA5b', RoyaltyABI, provider)
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

const assignRole = (user, amountStaked) => {

    if (amountStaked >= 100 && amountStaked < 500) user.roles.add('880394877202997298'), user.roles.remove('883601505033269309') // add Looter remove Fleet
    else if (amountStaked >= 500) user.roles.add('883601505033269309'), user.roles.remove('880394877202997298') // add Fleet remove Looter
    else user.roles.add('880394760290963457'), user.roles.remove('880394877202997298'), user.roles.remove('883601505033269309') // add Fresh remove Looter and Fleet
    let channel = client.channels.cache.get('916655352827744326');
    channel.send("<@" + user + "> Your Role has been successfully assigned");
}

async function ClaimRole(wallet, mes, userID) {
    const Address = web3.eth.accounts.recover("ForLootAndGlory Claim Role!", mes);
    const address = Address.toString().toLowerCase();
    console.log('recover address:', address)
    if (address === wallet) {
        let _balance = await royalty.addressStakedBalance(wallet);
        let balance = _balance * 10 ** 18;
        const guild = await client.guilds.fetch(guildId)
        const user = await guild.members.fetch(userID)
        assignRole(user, balance);
        console.log('success recover address')
    } else {
        console.log('failed to recover address')
    }
}

app.get('/', (req, res) => {
    console.log(req.query.userID)
    console.log(req.query.mes)
    console.log(req.query.wallet)
    ClaimRole(req.query.wallet, req.query.mes, req.query.userID)
    res.redirect(`${uiHost}/success-role`)
});

app.listen(process.env.PORT || port, () => console.log(`App listening`));

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function EmedRequest(event, requestInfos) {

    const gameId = requestInfos.gameId
    const scholarAddress = requestInfos.scholar
    const gameName = await scholarship.getGameString(gameId)
    const GameName = capitalizeFirstLetter(gameName)
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setURL('https://forlootandglory.io/')
        .setDescription(`Scholarship ${event}`)
        .addFields(
            { name: 'Game', value: `${GameName}` },
            { name: 'Scholar', value: `${scholarAddress}` },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmedGame(event, gameName) {

    const GameName = capitalizeFirstLetter(gameName)
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setURL('https://forlootandglory.io')
        .setDescription(`Scholarship ${event}`)
        .addFields(
            { name: 'Game', value: `${GameName}` },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

client.once('ready', async () => {
    console.log('Scholar Boat Ready!');

    const ChannelRequestCreated = client.channels.cache.get('1030751193166786622');
    const ChannelRequestAccepted = client.channels.cache.get('1030757802232258590');
    const ChannelGameAdd = client.channels.cache.get('1030757929663602728');

    scholarship.on('RequestCreated', async (requestId) => {
        console.log("RequestCreated", requestId)
        const requestInfos = await scholarship.fetchRequestId(requestId)
        let Embed = await EmedRequest('Request created', requestInfos)
        ChannelRequestCreated.send({ embeds: [Embed] })
    });

    scholarship.on('RequestAccepted', async (requestId) => {
        console.log('RequestAccepted:', requestId)
        const requestInfos = await scholarship.fetchRequestId(requestId)
        let Embed = await EmedRequest('Request accepted', requestInfos)
        ChannelRequestAccepted.send({ embeds: [Embed] })
    });

    scholarship.on('GameAdd', async (gameName) => {
        console.log('game', gameName)
        let Embed = await EmedGame('Game Add', gameName)
        ChannelGameAdd.send({ embeds: [Embed] })
    });
    scholarship.on('GameRemove', async (gameName) => {
        console.log('game', gameName)
        let Embed = await EmedGame('Game Remove', gameName)
        ChannelGameAdd.send({ embeds: [Embed] })
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'role') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Claim Role!')
                    .setURL(`${uiHost}/claim-role`)
                    .setStyle(ButtonStyle.Link)
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Claim your Role')
            .setURL('https://forlootandglory.io')
            .setDescription('If you are a FLAG Royalty Staker take your role below!')
            .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });

        await interaction.reply({ ephemeral: false, embeds: [embed], components: [row] });
    }
});

client.login(process.env.TOKEN);