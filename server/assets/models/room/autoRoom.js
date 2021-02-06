
import { AutoPlayerModel } from '../player/autoPlayer.js';

const PLAYER_NAMES = [
  'JamesBond',
  'AustinPowers',
  'JasonBourne',
  'EthanHunt',
  'AlexRider',
  'BlackWidow',
  'KimPossible',
  'MacGyver',
  'CarmenCortez',
  'Archer'
];

const ROUND_ROOMS = [
  [0, 0, 1, 1, 2, 2, 3, 3],
  [1, 2, 2, 3, 3, 4, 4, 1],
  [0, 0, 1, 1, 2, 2, 3, 3],
  [1, 2, 2, 3, 3, 4, 4, 1],
  [0, 0, 1, 1, 2, 2, 3, 3],
  [1, 2, 2, 3, 3, 4, 4, 1],
]

class AutoRoomModel {
  constructor($scope, roomName, playerCount) {
    this.$scope = $scope;
    this.roomName = roomName;
    this.roomURL = `${CLIENT_ENDPOINT}/${roomName}`;
    this.players = [];
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(
        new AutoPlayerModel(
          this.$scope,
          this,
          PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)],
          i
        )
      );
    }
  }

  getRoomIDThisRound(round, playerIndex) {
    return ROUND_ROOMS[round][playerIndex];
  }


  sendCode(isCorrect) {
    this.players.forEach(p => {
      p.sendEnterCode(isCorrect);
    })
  }
}

export { AutoRoomModel };