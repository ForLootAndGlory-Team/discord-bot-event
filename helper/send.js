const { ethers } = require('ethers');
const abi = require('../abi/collectibleABI.json')
require('dotenv').config();
const axios = require('axios');
const { providerTestnet } = require('./web3Const.js');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, providerTestnet);
const contractCollectible = '0xa5c3121849276F0449bf0CBa736a44b044B67621'
const contract = new ethers.Contract(contractCollectible, abi, signer)

function gasMargin(a, b) {
    r = a * b;
    return r;
}

async function addWhitelist(address, amount) {
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    const gasEtimated = await contract.estimateGas.editWhitelist(address, amount);
    try {
        const { data } = await axios({
            method: 'get',
            url: 'https://gasstation-mainnet.matic.network/v2'
        })
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
    } catch (e) {
        console.log(`error: ${e}`);
    } try {
        let oracle = await contract.editWhitelist(address, amount, { maxFeePerGas, maxPriorityFeePerGas, gasLimit: Math.ceil(gasMargin(gasEtimated, 1.1)) });
        console.log(`oracle ${address} ${amount} !`);
        const receipt = await oracle.wait();
        if (receipt.status) {
            console.log(`Whitelist ${address} for  ${amount} collectible is done!`);
        }
    } catch (e) {
        console.log(`error: ${e}`);
    }
};

module.exports = {
    addWhitelist
}