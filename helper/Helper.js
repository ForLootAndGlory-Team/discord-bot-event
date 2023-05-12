
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

const addToJsonFile = async (newData, path) => {
    const json = await fetch(`${path}.json?${timestamp}`)
    const parse = await JSON.parse(json)
    const newParse = await parse.push(newData)
    const data = JSON.stringify(newParse)
    writeFileSync(`${path}.json`,data)
}

const getRandomGif = async (keyword, channel) => {
    let url = `https://tenor.googleapis.com/v2/search?q=${keyword}&key=${process.env.TENOR_API}&limit=10`
    let response = await fetch(url)
    let gif = await response.json()
    let index = Math.floor(Math.random() * gif.results.length)
    channel.send(gif.results[index].url)
}

module.exports = {
    PriceJSON,
    writePrice,
    getRandomGif,
    addToJsonFile
}




