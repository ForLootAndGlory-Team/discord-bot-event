require('dotenv').config();
const { uiHost } = require('./const')
const express = require('express');
const { port } = require('./config.json');
const app = express();
const {
    EmedRequest,
    EmedGame,
    EmbedNewCharacter,
    EmbedCharacter,
    EmbedNewGear
} = require('./helper/embed.js');
const { ClaimRole } = require('./helper/claimRole.js');
const { addWhitelist } = require('./helper/send.js');
const {
    scholarship,
    character,
    gear } = require('./helper/web3Const.js')
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

const addresses = {};
const amounts = {};
const addresseAlreadyHere = []

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

const updateWhitelist = async (user, address, balance) => {
    if (addresses[user] && Number(balance) >= 100) {
        console.log('Not Allowed!')
    } else {
        let totalSpot = 0;
        for (const [user, amount] of Object.entries(amounts)) {
            totalSpot += amount;
        }
        if (totalSpot < 10000) {
            addresses[user] = address
            addresseAlreadyHere.push(address)
            let amount = 0;
            if (balance >= 100 && balance < 500) {
                amount = 1
            }
            if (balance >= 500 && balance < 2000) {
                amount = 2
            }
            if (balance >= 2000 && balance < 10000) {
                amount = 3
            }
            if (balance >= 10000) {
                amount = 4
            }
            amounts[user] = amount

            let channel = client.channels.cache.get('916655352827744326');
            channel.send("<@" + user + "> WhiteList for :" + `${amount} NFT`)
        }
    }
}

app.get('/', async (req, res) => {
    /*let balance =*/ await ClaimRole(req.query.wallet, req.query.mes, req.query.userID, client)
    /*let Allowed = true;
    for (let i = 0; i < addresseAlreadyHere.length; i++) {
        if (addresseAlreadyHere[i] === req.query.wallet) {
            Allowed = false;
        }
    }
    if (Allowed) {
        await updateWhitelist(req.query.userID, req.query.wallet, balance)
    }*/

    res.redirect(`${uiHost}/success-role`)
});

app.listen(process.env.PORT || port, () => console.log(`App listening`));

client.once('ready', async () => {
    console.log('Scholar Boat Ready!');

    const ChannelRequestCreated = client.channels.cache.get('1030751193166786622');
    const ChannelRequestAccepted = client.channels.cache.get('1030757802232258590');
    const ChannelGameAdd = client.channels.cache.get('1030757929663602728');
    const ChannelNewCharacter = client.channels.cache.get('1054398502421143565');
    const ChannelNewGear = client.channels.cache.get('1054781119842758727');

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
    character.on('NewCharacter', async (data) => {
        console.log('NewCharacter', data)
        for (let i = 0; i < data.length; i++) {
            let result = await EmbedNewCharacter('New Character', data[i])
            ChannelNewCharacter.send({ embeds: [result.Embed], files: [result.image] })
        }
    })
    gear.on('NewGear', async (data) => {
        console.log('New Gear', data.length)
        for (let i = 0; i < data.length; i++) {
            let result = await EmbedNewGear('New Gear', data[i])
            ChannelNewGear.send({ embeds: [result.Embed], files: [result.image] })
        }
    })
});

client.on(Events.InteractionCreate, async interaction => {
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
    if (interaction.commandName === 'character') {
        let characterId = interaction.options.getNumber('id');
        try {

            let data = await EmbedCharacter(`Character Infos : #${characterId}`, characterId)
            await interaction.reply({ ephemeral: true, embeds: [data.Embed], files: [data.image] });
        } catch (e) {
        }
    }
    if (interaction.commandName === 'gif') {
        try {
            let keyword = interaction.options.getString('keyword')
            let url = `https://tenor.googleapis.com/v2/search?q=${keyword}&key=${process.env.TENOR_API}&limit=10`
            let response = await fetch(url)
            let result = await response.json()
            let index = Math.floor(Math.random() * result.results.length)
            await interaction.reply(result.results[index].url)
        } catch (error) {
            console.log(error)
        }
    }
    if (interaction.commandName === 'whitelist') {
        let addressesArray = [];
        let totalSpot = 0;
        for (const [user, address] of Object.entries(addresses)) {
            addressesArray.push(address);
        }
        for (const [user, amount] of Object.entries(amounts)) {
            totalSpot += amount;
        }
        await interaction.reply(`Nombre de Spot reservé : \n ${(totalSpot)}/10000 \n Les adresses des membres whitelister sont : \n ${(addressesArray)}`)
    }
    if (interaction.commandName === 'jsonwhitelist') {
        let addressesArray = [];
        let amountsArray = [];
        for (const [user, address] of Object.entries(addresses)) {
            addressesArray.push(address);
        }
        for (const [user, amount] of Object.entries(amounts)) {
            amountsArray.push(amount);
        }
        await interaction.reply(`${JSON.stringify(addressesArray)} \n ${JSON.stringify(amountsArray)}`)
    }
    if (interaction.commandName === 'addwhitelist') {
        let amount = ['10']
        let address = []
        address.push(interaction.options.getString('address'))
        await interaction.reply(`Address ${address[0]} got ${10} testnet spot!`);
        await addWhitelist(address, amount);
    }
});

client.login(process.env.TOKEN);