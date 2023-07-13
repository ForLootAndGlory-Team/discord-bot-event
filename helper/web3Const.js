
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

const { TravelCommonAddress } = require('../store/StepTravelCommon.json')
const { NFT_CharactersAddress } = require('../store/StepCharacter.json')
const provider = ethers.getDefaultProvider(network);
const providerTestnet = ethers.getDefaultProvider(networkTestnet);

const characterABI = require("../abi/characterABI.json");
const RoyaltyABI = require("../abi/RoyaltyABI.json");
const lotteryABI = require("../abi/Lottery.json");
const TravelCABI = require("../abi/TravelCommonABI.json")
//const captainQuestABI = require('../abi/captainQuestABI.json');

const character = new ethers.Contract(NFT_CharactersAddress, characterABI, providerTestnet);
const royalty = new ethers.Contract('0x702cEC12BF55C58fb6dE889fac8A875964E5dA5b', RoyaltyABI, provider);
const lottery = new ethers.Contract('0x038620F5B13C3b242FE49E1E163350D738848fBF', lotteryABI, provider);
const travelC = new ethers.Contract(TravelCommonAddress, TravelCABI, providerTestnet);
//const captainQuest = new ethers.Contract('0x',captainQuestABI,providerTestnet);

module.exports = {
  networkTestnet,
  network,
  provider,
  providerTestnet,
  characterABI,
  RoyaltyABI,
  character,
  royalty,
  lottery,
  travelC
  //captainQuest
}
