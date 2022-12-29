const fs = require('fs/promises');
const path = require('path');
const { rpcURL } = require('../const.js');
const {
    royalty
} = require('./web3Const.js')

const Web3 = require("web3");
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(rpcURL)
);


const { guildId } = require('../config.json');
const { data } = require('../commands/character.js');

async function assignRole(user, amountStaked, wallet, client, userID) {

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
    await updateWhitelist(userID, amountStaked, wallet)
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
        await assignRole(user, balance, Address.toString(), client, userID);
        console.log('success recover address')
    } else {
        console.log('failed to recover address')
    }
}

async function updateWhitelist(user, balance, wallet) {
    if (balance >= 100) {
        let obj_ = {
            wallet: wallet,
            balance: balance
        }
        let obj = JSON.stringify(obj_)
        console.log('obj:', obj)
        await fs.writeFile(`../whitelist/${user}.json`, obj, (err) => {
            console.log(err)
        })
    }

}

async function createWhitelistfile() {
    let walletJson = []
    let amountJson = []
    await fs.readdir('../whitelist', async (err, files) => {
        files.forEach(async (file) => {
            //await fs.readFile(dir + `/${file}`, async (err, data) => {
            //    if (err) throw err;
            //    if (data) {
            console.log('file:', file)
            walletJson.push(file.wallet)
            amountJson.push(file.balance)
        })
        //});
    })

    return result = {
        userAddress: walletJson,
        amount: amountJson
    }
}

module.exports = {
    ClaimRole,
    createWhitelistfile
}