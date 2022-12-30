const { rpcURL } = require('../const.js');
const {
    royalty
} = require('./web3Const.js')

const Web3 = require("web3");
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(rpcURL)
);


const { guildId } = require('../config.json');

async function assignRole(user, amountStaked, client) {

    if (amountStaked >= 100 && amountStaked < 500) {
        user.roles.add('880394877202997298'), user.roles.remove('883601505033269309')

    } // add Looter remove Fleet

    else if (amountStaked >= 500) {
        user.roles.add('883601505033269309'), user.roles.remove('880394877202997298')

    } // add Fleet remove Looter
    else {
        user.roles.add('880394760290963457'), user.roles.remove('880394877202997298'), user.roles.remove('883601505033269309')
    } // add Fresh remove Looter and Fleet
    let channel = client.channels.cache.get('916655352827744326');
    channel.send("<@" + user + "> Your Role has been successfully assigned")
}

async function ClaimRole(wallet, mes, userID, client) {
    const Address = await web3.eth.accounts.recover("ForLootAndGlory Claim Role!", mes);
    const address = Address.toString().toLowerCase();
    console.log('recover address:', address)
    if (address === wallet) {
        let _balance = await royalty.addressStakedBalance(wallet);
        let balance_ = Number(_balance) * 10 ** 18;
        let balance = balance_.toFixed(0)
        console.log('balance: ', balance)
        const guild = await client.guilds.fetch(guildId)
        const user = await guild.members.fetch(userID)
        await assignRole(user, balance, Address.toString(), client);
        console.log('success recover address')
    } else {
        console.log('failed to recover address')
    }
}


module.exports = {
    ClaimRole
}