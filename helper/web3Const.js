
const ethers = require('ethers');

const { rpcTestnetURL, rpcURL } = require('../const.js');
const networkTestnet = {
  name: "mumbai",
  chainId: 80001,
  _defaultProvider: (providers) => new providers.JsonRpcProvider(rpcTestnetURL)
};
const network = {
  name: "polygon",
  chainId: 137,
  _defaultProvider: (providers) => new providers.JsonRpcProvider(rpcURL)
};

const provider = ethers.getDefaultProvider(network);
const providerTestnet = ethers.getDefaultProvider(networkTestnet);

const scholarABI = require("../abi/scholarABI.json");
const characterABI = require("../abi/characterABI.json");
const RoyaltyABI = require("../abi/RoyaltyABI.json");
const HuntABI = require("../abi/HuntABI.json");
const gearABI = require("../abi/gearABI.json");
const lotteryABI = require("../abi/Lottery.json");
//const captainQuestABI = require('../abi/captainQuestABI.json');

const character = new ethers.Contract('0xE3aDC90ef4a69124274039646dDD319815B2B8F6', characterABI, providerTestnet);
const royalty = new ethers.Contract('0x702cEC12BF55C58fb6dE889fac8A875964E5dA5b', RoyaltyABI, provider);
const huntCommon = new ethers.Contract('0xD2a8B1a52d1428315e6959111b11bE91Aa6687c2', HuntABI, providerTestnet);
const gear = new ethers.Contract('0x480d5bdB8EbD40a3e916868ccF7bc7Fddf4a595a', gearABI, providerTestnet);
const lottery = new ethers.Contract('0x038620F5B13C3b242FE49E1E163350D738848fBF', lotteryABI, provider);
//const captainQuest = new ethers.Contract('0x',captainQuestABI,providerTestnet);

module.exports = {
  networkTestnet,
  network,
  provider,
  providerTestnet,
  characterABI,
  RoyaltyABI,
  gearABI,
  character,
  royalty,
  huntCommon,
  gear,
  lottery
  //captainQuest
}
