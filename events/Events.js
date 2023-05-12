
const {
    ChannelRequestCreatedID,
    ChannelRequestAcceptedID,
    ChannelGameAddID,
    ChannelNewCharacterID,
    ChannelNewGearID,
    ChannelLotteryID
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
    character,
    gear,
    lottery
} = require("../helper/web3Const");

const EventsListener = async (client) => {
    //const ChannelNewCharacter = client.channels.cache.get(ChannelNewCharacterID);
    //const ChannelNewGear = client.channels.cache.get(ChannelNewGearID);
    const ChannelLottery = client.channels.cache.get(ChannelLotteryID);

    /*character.on('NewCharacter', async (data) => {
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
    })*/
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