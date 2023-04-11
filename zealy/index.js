require('dotenv').config();
const request = require('request');


const addresses = {};
const amounts = {};
const addresseAlreadyHere = []

const getUserIDcrew = async (userAddress) => {
    let user = {
        uri: "https://api.zealy.io/communities/:subdomain/users",
        subdomain: "forlootandglory",
        ethAddress: userAddress,
        method: 'GET',
        headers: {
            "x-api-key": process.env.ZEALY_KEY
        }
    }
    return user.id;
};


const updateCrew = async (userID, label, xp, description) => {
    let postData = {
        "label": label,
        "xp": xp,
        "description": description
    }
    let clientServerOptions = {
        uri: `https://api.zealy.io/communities/:forlootandglory/:${userID}`,
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            "x-api-key": process.env.ZEALY_KEY
        }
    }
    request(clientServerOptions, function (error, response) {
        console.log(error, response.body);
        return;
    });
}

const updateWhitelist = async (user, address, balance) => {
    if (addresses[user] && Number(balance) >= 100) {
        console.log('Not Allowed!')
    } else {
        let totalSpot = 0;
        for (const [user, amount] of Object.entries(amounts)) {
            totalSpot += amount;
        }
        if (totalSpot < 10000) {
            addresses[user] = address
            addresseAlreadyHere.push(address)
            let amount = 0;
            if (balance >= 100 && balance < 500) {
                amount = 1
            }
            if (balance >= 500 && balance < 2000) {
                amount = 2
            }
            if (balance >= 2000 && balance < 10000) {
                amount = 3
            }
            if (balance >= 10000) {
                amount = 4
            }
            amounts[user] = amount

            let channel = client.channels.cache.get('916655352827744326');
            channel.send("<@" + user + "> WhiteList for :" + `${amount} NFT`)
        }
    }
}

module.exports = {
    getUserIDcrew,
    updateCrew,
    updateWhitelist
}