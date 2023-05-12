const {
    ChannelRequestCreated,
    ChannelRequestAccepted,
    ChannelGameAdd,
    ChannelNewCharacter,
    ChannelNewGear,
    ChannelLottery
} = require("../helper/discordConst");
const {
    EmedRequest,
    EmedGame,
    EmbedNewCharacter,
    EmbedNewGear,
    EmedStartBet,
    EmedEndingBet,
    EmedWinner
} = require("../helper/embed");
const {
    scholarship,
    character,
    gear,
    lottery
} = require("../helper/web3Const");



const EventsListener = async () => {
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
}

module.exports = { EventsListener }