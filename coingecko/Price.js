const { get } = require('axios');

const { writePrice } = require('../helper/Helper.js');
const { ActivityType } = require('discord.js');

const getCoinGeckoPrice = async (coin) => {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;
      const response = await get(url, {
        method: 'GET'
      });
      let json = { price: response.data[coin].usd }
      writePrice(coin, json)
      console.log(json)
      return response.data[coin].usd;
    } catch (err) {
      const { price } = require(`../json/${coin}.json`)
      console.log(price)
      return price;
    }
  }

  const updatePriceActivity = async (coin,client) => {
    const Price = await getCoinGeckoPrice(coin)
    console.log(coin,' price : ', Price)
    client.user.setPresence({
        activities: [{ name: `FLAG ${Number(Price).toFixed(4)} $`, type: ActivityType.Watching }]
    });

    setInterval(async () => {
        const Price = await getCoinGeckoPrice(coin)
        console.log(coin,' price : ', Price)
        client.user.setPresence({
            activities: [{ name: `FLAG ${Number(Price).toFixed(4)} $`, type: ActivityType.Watching }]
        })
    }, 50 * 10000);
  }

  module.exports = {
    getCoinGeckoPrice,
    updatePriceActivity
  }