const {
    scholarship,
    character } = require('./web3Const.js')
const { CharacterAnalytic } = require('./pastEvents.js');
const { ethers } = require('ethers');

const {
    EmbedBuilder,
    AttachmentBuilder,
    Events,
    ActivityType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

const modal = new ModalBuilder()
    .setCustomId('ClaimRole')
    .setTitle('Claim Role')

const ethereumAddressIput = new TextInputBuilder()
    .setCustomId('ethereumAddressIput')
    .setLabel('What is your Polygon Address?')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(42)
    .setMinLength(42)
    .setRequired(true);

const messageSignInput = new TextInputBuilder()
    .setCustomId('messageSignInput')
    .setLabel("What is your message sign?")
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(132)
    .setMinLength(132)
    .setRequired(true);

const firstActionRow = new ActionRowBuilder().addComponents(ethereumAddressIput);
const secondActionRow = new ActionRowBuilder().addComponents(messageSignInput);

const modalBuild = modal.addComponents(firstActionRow, secondActionRow)


async function EmbedWinner(paid, winner) {
    const paid_ = ethers.utils.formatEther(paid);
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Lottery Bet Ending`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Draw will start soon bet is closed`)
        .addFields(
            { name: 'Jackpot', value: `${paid_}` },
            { name: 'Winner', value: `${winner}` }
        )
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmbedEndingBet() {
    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Lottery Bet Ending`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`Draw will start soon bet is closed`)
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return Embed;
}

async function EmbedStartBet() {
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

async function EmbedRequest(event, requestInfos) {

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

async function EmbedGame(event, gameName) {

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

async function EmbedBattle(event, data) {
    let atkShipSpe = ''
    let pathAtk = '';
    let atkCapSpe = ''
    let defShipSpe = ''
    let pathDef = '';
    let defCapSpe = ''
    let sailR = 0
    let boardR = 0
    let charR = 0
    if (data.attackerInfos.shipClass.toNumber() === 0) {
        atkShipSpe = 'Caravel'
        pathAtk = 'caravel'
    }
    if (data.attackerInfos.shipClass.toNumber() === 1) {
        atkShipSpe = 'Schooner'
        pathAtk = 'schooner'
    }
    if (data.attackerInfos.shipClass.toNumber() === 2) {
        atkShipSpe = 'Square Rig'
        pathAtk = 'squarerig'
    }

    if (data.attackerInfos.captainClass.toNumber() === 0) atkCapSpe = 'Pirate'
    if (data.attackerInfos.captainClass.toNumber() === 1) atkCapSpe = 'Corsair'
    if (data.attackerInfos.captainClass.toNumber() === 2) atkCapSpe = 'Smuggler'

    if (data.defenderInfos.shipClass.toNumber() === 0) {
        defShipSpe = 'Caravel'
        pathDef = 'caravel'
    }
    if (data.defenderInfos.shipClass.toNumber() === 1) {
        defShipSpe = 'Schooner'
        pathDef = 'schooner'
    }
    if (data.defenderInfos.shipClass.toNumber() === 2) {
        defShipSpe = 'SquareRig'
        pathDef = 'squarerig'
    }

    if (data.defenderInfos.captainClass.toNumber() === 0) defCapSpe = 'Pirate'
    if (data.defenderInfos.captainClass.toNumber() === 1) defCapSpe = 'Corsair'
    if (data.defenderInfos.captainClass.toNumber() === 2) defCapSpe = 'Smuggler'

    const AtkImage = new AttachmentBuilder(`./assets/ship/${pathAtk}/${pathAtk}.png`)
    const DefImage = new AttachmentBuilder(`./assets/ship/${pathDef}/${pathDef}.png`)
    // Round Sailing 
    let SailResult = ''
    if (Number(data.battle.resultSailing) > Number(data.battle.midSailing.toNumber())) {
        SailResult = 'Attacker Win'
    } else {
        SailResult = 'Defender Win'
    }

    // Round Charisma 
    let CharResult = ''
    if (Number(data.battle.resultCharisma) > Number(data.battle.midCharisma.toNumber())) {
        CharResult = 'Attacker Win'
    } else {
        CharResult = 'Defender Win'
    }

    // Round Boarding 
    let BoardResult = ''
    if (Number(data.battle.resultBoarding) > Number(data.battle.midBoarding.toNumber())) {
        BoardResult = 'Attacker Win'
    } else {
        BoardResult = 'Defender Win'
    }
    let path = undefined
    let image = undefined
    // Winner
    if (data.battle.attackerPoints < data.battle.defenderPoints) {
         image = DefImage
         path = pathDef
    } else {
        image = AtkImage
        path = pathAtk
    }

    const Embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${event}`)
        .setURL('https://app.forlootandglory.io/')
        .setDescription(`${event}`)
        .addFields(
            { name: 'Attacker', value: `Ship Token Id ${data.attackerInfos.shipId.toNumber().toString()}` },
            { name: '\u200B', value: '\u200B' },
            { name: 'Boarding', value: `${data.attackerInfos.boarding.toString()}`, inline: true },
            { name: 'Sailing', value: `${data.attackerInfos.sailing.toString()}`, inline: true },
            { name: 'Charisma', value: `${data.attackerInfos.charisma.toString()}`, inline: true },
            { name: 'Specialisation', value: `${data.attackerInfos.charisma.toString()}` },
            { name: 'Ship ', value: `${atkShipSpe}`, inline: true },
            { name: 'Captain ', value: `${atkCapSpe}`, inline: true },
            { name: '\u200B', value: '\u200B' }
        )
        .addFields(
            { name: 'Defender', value: `Ship Token Id ${data.defenderInfos.shipId.toNumber().toString()}` },
            { name: '\u200B', value: '\u200B' },
            { name: 'Boarding', value: `${data.defenderInfos.boarding.toString()}`, inline: true },
            { name: 'Sailing', value: `${data.defenderInfos.sailing.toString()}`, inline: true },
            { name: 'Charisma', value: `${data.defenderInfos.charisma.toString()}`, inline: true },
            { name: 'Ship Specialisation', value: `${defShipSpe}`, inline: true },
            { name: 'Captain Specialisation', value: `${defCapSpe}`, inline: true },
            { name: '\u200B', value: '\u200B' }
        )
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Sailing Round', value: `${SailResult}`, inline: true },
            { name: 'Charisma Round', value: `${CharResult}`, inline: true },
            { name: 'Boarding Round', value: `${BoardResult}`, inline: true },
            { name: '\u200B', value: '\u200B' }
        )
        .setImage(`attachment://${path}.png`)
        .setTimestamp()
        .setFooter({ text: 'For Loot And Glory', iconURL: 'https://forlootandglory.eth.limo/token_logo.png' });
    return data = {
        Embed: Embed,
        image: image,
    };
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
    const image = new AttachmentBuilder(`./assets/character/${path}/${path}.png`)
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
    const image = new AttachmentBuilder(`./assets/character/${path}/${path}.png`)
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
    const image = new AttachmentBuilder(`./assets/character/pirate/parts/${path}.png`)
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
    EmbedRequest,
    EmbedGame,
    EmbedNewCharacter,
    EmbedCharacter,
    EmbedNewGear,
    EmbedStartBet,
    EmbedEndingBet,
    EmbedWinner,
    EmbedBattle,
    modalBuild
}