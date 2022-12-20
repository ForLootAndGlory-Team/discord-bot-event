
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

const scholarship = new ethers.Contract('0x174611Fa14d1cb4038F221E33Dcc446F39DDEf22', scholarABI, provider);
const character = new ethers.Contract('0x8Ffad43CCeA4d6cA0db5E431A57a4C1d52E41c56', characterABI, providerTestnet);
const royalty = new ethers.Contract('0x702cEC12BF55C58fb6dE889fac8A875964E5dA5b', RoyaltyABI, provider);
const huntCommon = new ethers.Contract('0x7eFa33679c27d0C27F43E908539F816eb4DB76Ab', HuntABI, providerTestnet);
const gear = new ethers.Contract('0x19eF70184CaD4228bf191F3c08C2236b6cA30421', gearABI, providerTestnet);

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
    gear
}
