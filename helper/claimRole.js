const fs = require('fs');
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

async function assignRole(user, amountStaked, wallet, client) {

    if (amountStaked >= 100 && amountStaked < 500) {
        user.roles.add('880394877202997298'), user.roles.remove('883601505033269309')
        await updateWhitelist(user, wallet)
    } // add Looter remove Fleet

    else if (amountStaked >= 500) {
        user.roles.add('883601505033269309'), user.roles.remove('880394877202997298')
        await updateWhitelist(user, wallet)
    } // add Fleet remove Looter
    else {
        user.roles.add('880394760290963457'), user.roles.remove('880394877202997298'), user.roles.remove('883601505033269309')
    } // add Fresh remove Looter and Fleet
    let channel = client.channels.cache.get('916655352827744326');
    channel.send("<@" + user + "> Your Role has been successfully assigned");
}

async function ClaimRole(wallet, mes, userID, client) {
    const Address = await web3.eth.accounts.recover("ForLootAndGlory Claim Role!", mes);
    const address = Address.toString().toLowerCase();
    console.log('recover address:', address)
    if (address === wallet) {
        let _balance = await royalty.addressStakedBalance(wallet);
        let balance = _balance * 10 ** 18;
        const guild = await client.guilds.fetch(guildId)
        const user = await guild.members.fetch(userID)
        await assignRole(user, balance, Address.toString(), client);
        console.log('success recover address')
    } else {
        console.log('failed to recover address')
    }
}

async function updateWhitelist(user, balance, wallet) {
    if (balance >= 100) {
        let obj = {
            wallet: wallet,
            balance: balance
        };
        let dir = '../whitelist'
        fs.readdir(dir, (err, files) => {
            console.log(files.length);
            len = files.length;
        });
        let isExist = false;
        for (let i = 0; i < files.length; i++) {
            fs.readFile(`../whitelist/${files[i]}`, function read(err, data) {
                if (err) {
                    throw err;
                }
            })
            if (data.wallet === wallet) {
                isExist = true
            }

        }
        if (isExist === false) {
            fs.writeFile(`../whitelist/${user}.json`, obj, (err) => {
                console.log(err)
            })
        }
    }
}

async function createWhitelistfile() {
    let dir = '../whitelist';
    let walletJson = []
    let amountJson = []
    fs.readdir(dir, (err, files) => {
        console.log(files.length);
        len = files.length;
    });
    for (let i = 0; i < files.length; i++) {
        fs.readFile(`../whitelist/${files[i]}`, function read(err, data) {
            if (err) {
                throw err;
            }
            walletJson.push(data.wallet);
            let amountNFT = Math.floor(Number(data.balance) / 100);
            amountJson.push(amountNFT);
        });
    }
    fs.writeFile('../json/walletJson.json', walletJson, (err) => {
        console.log(err)
    })
    fs.writeFile('../json/amountJson.json', amountJson, (err) => {
        console.log(err)
    })
}

module.exports = {
    ClaimRole,
    createWhitelistfile
}