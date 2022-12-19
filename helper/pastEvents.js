const ethers = require('ethers');
const {
    huntCommon
} = require('./web3Const.js');

async function CharacterAnalytic(characterId) {
    let interfaceABI = ['event HuntResult((uint32,uint32,uint32,uint32,uint64,uint64,bool,address,address,address,uint256,uint256))'];
    let iface = new ethers.utils.Interface(interfaceABI);
    let eventFilter = huntCommon.filters.HuntResult()
    let events = await huntCommon.queryFilter(eventFilter, 29498797, 'latest')
    let parsedEvent = events.map(function (log) { return iface.parseLog(log) });
    let TotalWIN = 0;
    let TotalHUNT = 0;
    let userAddress;
    for (let i = 0; i < parsedEvent.length; i++) {
        const [AmountHunt, percentToRenter, totalExp, totalWin, totalMap, totalStats, isRenting, user, renter, owner, tokenId, bonusFLAG] = parsedEvent[i].args[0];
        if (Number(tokenId) === characterId) {
            TotalHUNT += Number(AmountHunt)
            TotalWIN += Number(totalWin)
            userAddress = user
        }
    }
    // Vérifier si aucun événement HuntResult n'a été trouvé
    if (TotalHUNT === 0) {
        // Ne pas retourner de résultats
        return null;
    }
    let WinRate = (TotalWIN / TotalHUNT) * 100;
    let result;
    // Retourner les résultats sous forme d'objet
    return result = WinRate.toFixed(0) + '%';
}

module.exports = {
    CharacterAnalytic
}