require('dotenv').config();
const abi = require("./abi.json");
const RoyaltyABI = require("./RoyaltyABI.json");
const { token } = require('./config.json');
const ethers = require('ethers');
const Web3 = require("web3");
const express = require('express');
const { port, guildId } = require('./config.json');
const rpcURL = "https://polygon-mainnet.g.alchemy.com/v2/yuyhEgKoM-VxgBB9yLAHS41TKRXY6AV2" //mainnet
const app = express();
const web3 = new Web3(
    // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
    new Web3.providers.WebsocketProvider(rpcURL)
);
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const network = {
    name: "polygon",
    chainId: 137,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(rpcURL)
};
const provider = ethers.getDefaultProvider(network);

const scholarship = new ethers.Contract('0x3fCaB5ddc6bb4f7999044cec9Cd994F0602B507C', abi, provider);
const royalty = new ethers.Contract('0x0d63b9848F35fA014Aa5a6e3e500cf18e20fbE95', RoyaltyABI, provider)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const assignRole = (user, amountStaked) => {
    
    if (amountStaked >= 100 && amountStaked < 500) user.roles.add('1018914941442465863'), user.roles.remove('1018914991644086439') // add Looter remove Fleet
    else if (amountStaked >= 500) user.roles.add('1018914991644086439'), user.roles.remove('1018914941442465863') // add Fleet remove Looter
    else user.roles.add('1018915028092596235'), user.roles.remove('1018914941442465863'), user.roles.remove('1018914991644086439') // add Fresh remove Looter and Fleet
    let channel = client.channels.cache.get('910189947569451012');
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
        const user =  await guild.members.fetch(userID)
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
    res.redirect('http://localhost:3000/success-role')
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

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
        .setURL('https://discord.js.org/')
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
        .setURL('https://discord.js.org/')
        .setDescription(`Scholarship ${event}`)
        .addFields(
            { name: 'Game', value: `${GameName}` },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

client.once('ready', async () => {
    console.log('Ready!',);

    const ChannelRequestCreated = client.channels.cache.get('910189947569451012');
    const ChannelRequestAccepted = client.channels.cache.get('910189947569451012');
    const ChannelGameAdd = client.channels.cache.get('910189947569451012');

    scholarship.on('RequestCreated', async (requestId) => {
        console.log("RequestCreated", requestId)
        const requestInfos = await scholarship.fetchRequestId(requestId)
        let Embed = await EmedRequest('Request created', requestInfos)
        ChannelRequestCreated.send({ embeds: [Embed] })
    });

    scholarship.on('RequestAccepted', async (requestId) => {
        console.log('requestId:', requestId)
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

client.login(process.env.TOKEN);