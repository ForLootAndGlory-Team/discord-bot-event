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
    EmbedNewGear,
    EmedStartBet,
    EmedEndingBet,
    EmedWinner
} = require('./helper/embed.js');
const { ClaimRole } = require('./helper/claimRole.js');
const { addWhitelist } = require('./helper/send.js');
const {
    scholarship,
    character,
    gear,
    lottery,
    getCoinGeckoPrice
    // captainQuest
} = require('./helper/web3Const.js')
const { checkmessage } = require('./msg/MessageCreate.js')
const { Client, GatewayIntentBits, EmbedBuilder, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ActivityType } = require('discord.js');

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

app.get('/claim', async (req, res) => {
    try {
        let result = await ClaimRole(req.query.wallet, req.query.mes, req.query.userID, client)
        if (result.bool === true) {
            let channel = client.channels.cache.get('916655352827744326');
            channel.send("<@" + user + "> Your Role " + userRole + " has been successfully assigned")
        }
        res.redirect(`${uiHost}/success-role`)
    } catch (error) {
        res.redirect(`${uiHost}/error-role`)
    }

});

app.get('/', (request, response) => {
    return response.sendFile('index.html', { root: '.' });
});

app.listen(process.env.PORT || port, () => console.log(`App listening`));

client.once('ready', async () => {
    console.log('Scholar Boat Ready!');
    const FlagPrice = await getCoinGeckoPrice("for-loot-and-glory")
    console.log('FLAG price:', FlagPrice)
    client.user.setPresence({
        activities: [{ name: `FLAG ${Number(FlagPrice).toFixed(4)} $`, type: ActivityType.Watching }]
    });

    setInterval(async () => {
        const FlagPrice = await getCoinGeckoPrice("for-loot-and-glory")
        console.log('FLAG price:', FlagPrice)
        client.user.setPresence({
            activities: [{ name: `FLAG ${Number(FlagPrice).toFixed(4)} $`, type: ActivityType.Watching }]
        })
    }, 50 * 10000);
    const ChannelRequestCreated = client.channels.cache.get('1030751193166786622');
    const ChannelRequestAccepted = client.channels.cache.get('1030757802232258590');
    const ChannelGameAdd = client.channels.cache.get('1030757929663602728');
    const ChannelNewCharacter = client.channels.cache.get('1054398502421143565');
    const ChannelNewGear = client.channels.cache.get('1054781119842758727');
    const ChannelLottery = client.channels.cache.get('1103289472512184341');
    //const ChannelCaptainQuest = client.channels.cache.get('1093551575240298599');

    /*captainQuest.on('ClaimCaptain', async (data) => {
        console.log('ClaimCaptain', data)
        ChannelCaptainQuest.send(`Captain Quest Completed: user: ${data.user} \n characterId: ${data.tokenId}`)
    })*/

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
        console.log('NewCharacter', data.length)
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
    lottery.on('BetStart', async () => {
        let result = await EmedStartBet()
        ChannelLottery.send({ embeds: [result] })
    })
    lottery.on('BetEnding', async () => {
        let result = await EmedEndingBet()
        ChannelLottery.send({ embeds: [result] })
    })
    lottery.on('Winner', async (paid, winner) => {
        let result = await EmedWinner(paid, winner)
        ChannelLottery.send({ embeds: [result] })
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

client.on("messageCreate", async (msg) => {
    await checkmessage(msg);
}
);

client.login(process.env.TOKEN);