const {
    scholarship,
    character } = require('./web3Const.js')
const { CharacterAnalytic } = require('./pastEvents.js');

const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

async function EmedWinner(paid, winner) {
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Lottery Bet Ending`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Draw will start soon bet is closed`)
        .addFields(
            { name: 'Jackpot', value: `${paid}` },
            { name: 'Winner', value: `${winner}` }
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmedEndingBet() {
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Lottery Bet Ending`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Draw will start soon bet is closed`)
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmedStartBet() {
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Lottery Bet Start`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`You can bet on dapp lottery tab`)
        .addFields(
            { name: 'Ticket', value: `1 FLAG per Ticket` },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmedRequest(event, requestInfos) {

    const gameId = requestInfos.gameId
    const scholarAddress = requestInfos.scholar
    const gameName = await scholarship.getGameString(gameId)
    const GameName = capitalizeFirstLetter(gameName)
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setURL('https://app.forlootandglory.io/')
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
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Scholarship ${event}`)
        .addFields(
            { name: 'Game', value: `${GameName}` },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmbedNewCharacter(event, data) {

    let spe = '';
    let path = '';
    if (data.specialisation.toNumber().toString() === '0') {
        spe = 'Pirate'
        path = 'pirate'
    }
    if (data.specialisation.toNumber().toString() === '1') {
        spe = 'Corsair'
        path = 'corsair'
    }
    if (data.specialisation.toNumber().toString() === '2') {
        spe = 'Smuggler'
        path = 'smuggler'
    }
    const image = new AttachmentBuilder(`./character/${path}/${path}.png`)
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setImage(`attachment://${path}.png`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Character #${data.tokenId.toNumber()}`)
        .addFields(
            { name: 'Specialisation', value: `${spe}`, inline: true },
            { name: 'Thirst', value: `${data.thirst}`, inline: true },
            { name: 'Experience', value: `${data.experience.toNumber()}`, inline: true },
            { name: 'Level', value: `${(Math.sqrt(data.experience)).toFixed(0)}` },
        )
        .addFields(
            { name: 'Boarding Base', value: `${data.boarding}`, inline: true },
            { name: 'Sailing Base', value: `${data.sailing}`, inline: true },
            { name: 'Charisma Base', value: `${data.charisma}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return data = {
        Embed: Embed,
        image: image
    };
}

async function EmbedCharacter(event, characterId) {

    const characterInfos = await character.getCharacterInfos(characterId);
    let spe = '';
    let path = '';
    if (characterInfos.specialisation.toString() === '0') {
        spe = 'Pirate'
        path = 'pirate'
    }
    if (characterInfos.specialisation.toString() === '1') {
        spe = 'Corsair'
        path = 'corsair'
    }
    if (characterInfos.specialisation.toString() === '2') {
        spe = 'Smuggler'
        path = 'smuggler'
    }
    const totalstats = await character.getCharacterTotalStats(characterId)
    const winRateCommon = await CharacterAnalytic(characterId)
    const image = new AttachmentBuilder(`./character/${path}/${path}.png`)
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setImage(`attachment://${path}.png`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Character #${characterInfos.tokenId}`)
        .addFields(
            { name: 'Specialisation', value: `${spe}`, inline: true },
            { name: 'Thirst', value: `${characterInfos.thirst}`, inline: true },
            { name: 'Experience', value: `${characterInfos.experience}`, inline: true },
            { name: 'Level', value: `${(Math.sqrt(characterInfos.experience)).toFixed(0)}` },
            { name: 'WinRate Common', value: winRateCommon, inline: true },
        )
        .addFields(
            { name: 'Boarding Base', value: `${characterInfos.boarding}`, inline: true },
            { name: 'Sailing Base', value: `${characterInfos.sailing}`, inline: true },
            { name: 'Charisma Base', value: `${characterInfos.charisma}`, inline: true },
        )
        .addFields(
            { name: 'Boarding', value: `${totalstats.boarding}`, inline: true },
            { name: 'Sailing', value: `${totalstats.sailing}`, inline: true },
            { name: 'Charisma', value: `${totalstats.charisma}`, inline: true },
            { name: 'Total', value: `${(Number(totalstats.charisma) + Number(totalstats.sailing) + Number(totalstats.boarding))}` },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return data = {
        Embed: Embed,
        image: image
    };
}

async function EmbedNewGear(event, data) {

    let spe = '';
    let path = '';
    let rarity = '';
    if (data.slot.toString() === '2') {
        spe = 'Mainhand'
        path = 'mainhand'
    }
    if (data.slot.toString() === '1') {
        spe = 'Chest'
        path = 'chest'
    }
    if (data.slot.toString() === '0') {
        spe = 'Head'
        path = 'head'
    }
    if (data.slot.toString() === '4') {
        spe = 'Feets'
        path = 'feet'
    }
    if (data.slot.toString() === '3') {
        spe = 'Legs'
        path = 'leg'
    }
    if (data.rarity.toString() === '0') {
        rarity = 'Common'
    }
    if (data.rarity.toString() === '1') {
        rarity = 'Rare'
    }
    if (data.rarity.toString() === '2') {
        rarity = 'Legendary'
    }
    const image = new AttachmentBuilder(`./character/pirate/parts/${path}.png`)
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setImage(`attachment://${path}.png`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Gear #${data.tokenId.toNumber()}`)
        .addFields(
            { name: 'Slot', value: `${spe}`, inline: true },
            { name: 'Exp Required', value: `${data.experience.toNumber()}`, inline: true },
            { name: 'Rarity', value: `${rarity}`, inline: true },
        )
        .addFields(
            { name: 'Boarding', value: `${data.boarding}`, inline: true },
            { name: 'Sailing', value: `${data.sailing}`, inline: true },
            { name: 'Charisma', value: `${data.charisma}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return data = {
        Embed: Embed,
        image: image
    };
}

module.exports = {
    EmedRequest,
    EmedGame,
    EmbedNewCharacter,
    EmbedCharacter,
    EmbedNewGear,
    EmedStartBet,
    EmedEndingBet,
    EmedWinner
}