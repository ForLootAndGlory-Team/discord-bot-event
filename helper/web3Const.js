
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
//const captainQuestABI = require('../abi/captainQuestABI.json');

const scholarship = new ethers.Contract('0x174611Fa14d1cb4038F221E33Dcc446F39DDEf22', scholarABI, provider);
const character = new ethers.Contract('0xc1e6C2b308369Dd79384D97E22adc9d8933d4BB8', characterABI, providerTestnet);
const royalty = new ethers.Contract('0x702cEC12BF55C58fb6dE889fac8A875964E5dA5b', RoyaltyABI, provider);
const huntCommon = new ethers.Contract('0xD2a8B1a52d1428315e6959111b11bE91Aa6687c2', HuntABI, providerTestnet);
const gear = new ethers.Contract('0x480d5bdB8EbD40a3e916868ccF7bc7Fddf4a595a', gearABI, providerTestnet);
//const captainQuest = new ethers.Contract('0x',captainQuestABI,providerTestnet);

module.exports = {
    networkTestnet,
    network,
    provider,
    providerTestnet,
    scholarABI,
    characterABI,
    RoyaltyABI,
    gearABI,
    scholarship,
    character,
    royalty,
    huntCommon,
    gear,
    //captainQuest
}
