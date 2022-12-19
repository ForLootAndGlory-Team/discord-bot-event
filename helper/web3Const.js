
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


const scholarship = new ethers.Contract('0x174611Fa14d1cb4038F221E33Dcc446F39DDEf22', scholarABI, provider);
const character = new ethers.Contract('0x8Ffad43CCeA4d6cA0db5E431A57a4C1d52E41c56', characterABI, providerTestnet);
const royalty = new ethers.Contract('0x702cEC12BF55C58fb6dE889fac8A875964E5dA5b', RoyaltyABI, provider);

module.exports = {
    networkTestnet, 
    network, 
    provider, 
    providerTestnet, 
    scholarABI, 
    characterABI, 
    RoyaltyABI,
    scholarship, 
    character,
    royalty
}
