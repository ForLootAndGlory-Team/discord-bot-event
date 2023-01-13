//create object with K-Factor(without it defaults to 32)
const EloRank = require('elo-rank');
const elo = new EloRank(15);
const fs = require('fs/promises')

const AllPlayer = []

async function newBattle(AddressPlayerA, AddressPlayerB, isAwin) {

    let playerA = 1200;
    let playerB = 1400;

    if (AllPlayer[AddressPlayerA]) {
        playerA = AllPlayer[AddressPlayerA].playerElo
        console.log('player A :', playerA)
    }
    if (AllPlayer[AddressPlayerB]) {
        playerB = AllPlayer[AddressPlayerB].playerElo
        console.log('player B :', playerB)
    }
    var expectedScoreA = elo.getExpected(playerA, playerB);
    var expectedScoreB = elo.getExpected(playerB, playerA);
    if (isAwin) {
        playerA = elo.updateRating(expectedScoreA, 1, playerA);
        playerB = elo.updateRating(expectedScoreB, 0, playerB);

    } else {

        playerA = elo.updateRating(expectedScoreA, 0, playerA);
        playerB = elo.updateRating(expectedScoreB, 1, playerB);
    }
    let PlayerA = {
        address: AddressPlayerA,
        playerElo: playerA
    }
    let PlayerB = {
        address: AddressPlayerB,
        playerElo: playerB
    }
    console.log('Player A New Elo:', playerA)
    console.log('Player B new Elo :', playerB)
    AllPlayer.push(PlayerA)
    AllPlayer.push(PlayerB)
    console.log(AllPlayer)
    await fs.writeFile()
}

newBattle('ox1', 'ox2', true)