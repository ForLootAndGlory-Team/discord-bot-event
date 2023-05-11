const { ethers } = require('ethers');
const abiC = require('./abi/CompoundABI.json');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/yuyhEgKoM-VxgBB9yLAHS41TKRXY6AV2");

const delayHours = 60 * 60 * 1000; // 1 hour in msec
const signerC = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const compoundAddrFlagWeth = "0xA92AAf9b83fc08c4C2A274Fde68D9d2E71027f93";
const compoundAddrFlagMatic = "0x7DECF3893CD7F27603864BfA7Bba92615e6BdDe2";

const axios = require('axios');
const contractFlagWeth = new ethers.Contract(compoundAddrFlagWeth, abiC, signerC);
const contractFlagMatic = new ethers.Contract(compoundAddrFlagMatic, abiC, signerC);

function gasMargin(a, b) {
    r = a * b;
    return r;
}

async function Compound(contract) {
    console.log(`Compound ${contract} is running and wait for interval.`);
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    const gasEtimated = await contract.estimateGas.compound();
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
        let compound = await contract.compound({ maxFeePerGas, maxPriorityFeePerGas, gasLimit: Math.ceil(gasMargin(gasEtimated, 1.1)) });
        console.log(`Compound ${contract}!`);
        const receipt = await compound.wait();
        if (receipt.status) {
            console.log(`Transaction receipt compound ${contract} : https://polygonscan.com/tx/${receipt.logs[1].transactionHash}\n`);
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
    compoundAll
}

