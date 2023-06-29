const { ethers } = require('ethers');
const abiC = require('./abi/CompoundABI.json');
const axios = require('axios');
const { ChannelAdminID } = require('../helper/discordConst');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com");

const delayHours = 3 * 60 * 60 * 1000; // 1 hour in msec
const signerC = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const compoundAddrFlagWeth = "0xA92AAf9b83fc08c4C2A274Fde68D9d2E71027f93";
const compoundAddrFlagMatic = "0x7DECF3893CD7F27603864BfA7Bba92615e6BdDe2";

const contractFlagWeth = new ethers.Contract(compoundAddrFlagWeth, abiC, signerC);
const contractFlagMatic = new ethers.Contract(compoundAddrFlagMatic, abiC, signerC);

function gasMargin(a, b) {
    r = a * b;
    return r;
}

async function Compound(contract) {
    console.log(`Compound ${contract} is running and wait for interval.`);
    let maxFeePerGas = ethers.BigNumber.from(0) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(0) // fallback to 40 gwei
    const gasEtimated = await contract.estimateGas.compound();
    let gasParams = {}
    try {
        const { data } = await axios({
            method: 'get',
            url: 'https://gasstation.polygon.technology/v2'
        })
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
        console.log(data)
    } catch (e) {
        console.log(`error: ${e}`);
    }
    let nonce = await provider.getTransactionCount("0x8Dab3C844b0d33Ba3CC74a302C7813A11506502D")
    console.log('nonce : ', nonce)
    gasParams = {
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        gasLimit: Math.ceil(gasMargin(gasEtimated, 1.1)),
        nonce: nonce
    }
    console.log('Gas Parametre: ', gasParams)
    try {
        let compound = await contract.compound(gasParams);
        console.log(`Compound ${JSON.stringify(compound)}!`);
        const receipt = await compound.wait();
        if (receipt.status) {
            console.log(`Transaction receipt compound ${JSON.stringify(contract)} : https://polygonscan.com/tx/${receipt.logs[1].transactionHash}\n`);
        }
    } catch (e) {
        console.log(`error: ${e}`);
    }
};


async function totalCompound() {
    await Compound(contractFlagMatic);
    await Compound(contractFlagWeth);
};

async function compoundAll() {
    console.log("Loop start for compound");
    setInterval(totalCompound, delayHours);
};

module.exports = {
    compoundAll,
    totalCompound
}

