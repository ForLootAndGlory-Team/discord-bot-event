
const { writeFileSync } = require('fs')

const writePrice = async (coin, obj) => {
    let data = JSON.stringify(obj);
    writeFileSync(`./json/${coin}.json`, data);
}

const timestamp = new Date().getTime

const PriceJSON = async (coin) => {
    const response = await fetch(`json/${coin}.json?${timestamp}`)
    const data = await response.json();
    return data;
}

module.exports = {
    PriceJSON,
    writePrice
}




