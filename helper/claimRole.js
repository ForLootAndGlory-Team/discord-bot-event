const { rpcURL } = require('../const.js');
const {
    royalty
} = require('./web3Const.js')

const Web3 = require("web3");
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(rpcURL)
);

// Role Id
const landLubberRole = '1094612796030865428'
//const monkeyPounder = '1094971972275937351'
const looterRole = '1094613093558005820'
const smugglerRole = '1094613477127114823'
const corsairRole = '1094613575219290203'
const sailingMasterRole = '1094614732125777980'
const amiralRole = '1094614860526002236'

// Role Stake Amount
const landLubberAmount = 0;
//const monkeyPounder = '50' ou 1 Collectible
const looterAmount = 100;
const smugglerAmount = 500;
const corsairAmount = 1000;
const sailingMasterAmount = 5000;
const amiralAmount = 10000;


const { guildId } = require('../config.json');

async function assignRole(user, amountStaked, client) {
    let userRole = ''
    // Amiral
    if (amountStaked >= amiralAmount) {
        await user.roles.add(landLubberRole)
        await user.roles.add(looterRole)
        await user.roles.add(smugglerRole)
        await user.roles.add(corsairRole)
        await user.roles.add(sailingMasterRole)
        await user.roles.add(amiralRole)
        userRole = 'Amiral'
    }
    // Sailing Master
    else if (amountStaked >= sailingMasterAmount && amountStaked < amiralAmount) {
        await user.roles.add(landLubberRole)
        await user.roles.add(looterRole)
        await user.roles.add(smugglerRole)
        await user.roles.add(corsairRole)
        await user.roles.add(sailingMasterRole)
        await user.roles.remove(amiralRole)
        userRole = 'Sailing Master'
    }
    // Corsair
    else if (amountStaked >= corsairAmount && amountStaked < sailingMasterAmount) {
        await user.roles.add(landLubberRole)
        await user.roles.add(looterRole)
        await user.roles.add(smugglerRole)
        await user.roles.add(corsairRole)
        await user.roles.remove(amiralRole)
        await user.roles.remove(sailingMasterRole)
        userRole = 'Corsair'
    }
    // Smuggler
    else if (amountStaked >= smugglerAmount && amountStaked < corsairAmount) {
        await user.roles.add(landLubberRole)
        await user.roles.add(looterRole)
        await user.roles.add(smugglerRole)
        await user.roles.remove(corsairRole)
        await user.roles.remove(amiralRole)
        await user.roles.remove(sailingMasterRole)
        userRole = 'Smuggler'
    }
    // Looter
    else if (amountStaked >= looterAmount && amountStaked < smugglerAmount) {
        await user.roles.add(landLubberRole)
        await user.roles.add(looterRole)
        await user.roles.remove(smugglerRole)
        await user.roles.remove(corsairRole)
        await user.roles.remove(amiralRole)
        await user.roles.remove(sailingMasterRole)
        userRole = 'Looter'
    }
    // LandLubber
    else if (amountStaked < 100) {
        await user.roles.add(landLubberRole)
        await user.roles.remove(looterRole)
        await user.roles.remove(smugglerRole)
        await user.roles.remove(corsairRole)
        await user.roles.remove(amiralRole)
        await user.roles.remove(sailingMasterRole)
        userRole = 'Landlubber'
    }
    let result = {
        bool: true,
        user: user,
        userRole: userRole
    }
    return result
}

async function parseIntBalance(amount) {
    console.log(amount)
    let balance_ = Number(amount) / 10 ** 18;
    console.log(balance_)
    let balance = parseInt(balance_).toFixed(0)
    console.log('balance: ', balance)
    return balance;
}

async function ClaimRole(wallet, mes, userID, client) {
    const Address = await web3.eth.accounts.recover("ForLootAndGlory Claim Role!", mes);
    const address = Address.toString().toLowerCase();
    console.log('recover address:', address)
    let balance;
    if (address === wallet) {
        let _balance = await royalty.addressStakedBalance(wallet);
        let balance = await parseIntBalance(_balance)
        const guild = await client.guilds.fetch(guildId)
        const user = await guild.members.fetch(userID)
        await assignRole(user, balance, client);
        console.log('success recover address')
    } else {
        console.log('failed to recover address')
    }
    return balance
}


module.exports = {
    ClaimRole
}