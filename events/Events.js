
const {
    ChannelRequestCreatedID,
    ChannelRequestAcceptedID,
    ChannelGameAddID,
    ChannelNewCharacterID,
    ChannelNewGearID,
    ChannelLotteryID,
    ChannelTravelCID
} = require("../helper/discordConst");
const {
    EmbedRequest,
    EmbedGame,
    EmbedNewCharacter,
    EmbedNewGear,
    EmbedStartBet,
    EmbedEndingBet,
    EmbedWinner,
    EmbedBattle
} = require("../helper/embed");
const {
    character,
    gear,
    lottery,
    travelC
} = require("../helper/web3Const");

const EventsListener = async (client) => {
    //const ChannelNewCharacter = client.channels.cache.get(ChannelNewCharacterID);
    //const ChannelNewGear = client.channels.cache.get(ChannelNewGearID);
    const ChannelLottery = client.channels.cache.get(ChannelLotteryID);
    const ChannelTravelC = client.channels.cache.get(ChannelTravelCID);

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
        let result = await EmbedStartBet()
        ChannelLottery.send({ embeds: [result] })
    })
    lottery.on('BetEnding', async () => {
        let result = await EmbedEndingBet()
        ChannelLottery.send({ embeds: [result] })
    })
    lottery.on('Winner', async (paid, winner) => {
        let result = await EmbedWinner(paid, winner)
        ChannelLottery.send({ embeds: [result] })
    })
    travelC.on('BattleResult', async (battle, attackerInfos, defenderInfos) => {
        const data = {
            battle: battle,
            attackerInfos: attackerInfos,
            defenderInfos: defenderInfos
        }
        console.log('BattleResult : ', data)
        let result = await EmbedBattle('Travel Common Battle', data)
        ChannelTravelC.send({ embeds: [result.Embed], files: [result.image] })
    })
}

module.exports = { EventsListener }