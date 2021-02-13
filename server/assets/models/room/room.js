
import { PlayerModel } from '../player/player.js';

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

class RoomModel {
  constructor($scope, roomName, playerCount) {
    this.$scope = $scope;
    this.roomName = roomName;
    this.roomURL = `${CLIENT_ENDPOINT}/${roomName}`;
    this.players = [];
    this.allCode = '';
    this.makePlayers(playerCount);
  }

  makePlayers(playerCount) {
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(new PlayerModel(this.$scope, this, PLAYER_NAMES[i]));
    }
  }

  sendReadyUp() {
    this.players.forEach(p => {
      p.sendReadyUp();
    });
  }

  sendRoomChoices() {
    this.players.forEach((p, i) => {
      p.response.roomID = Math.floor(i / 2);
      p.sendRandomRoom();
    });
  }

  sendCode(isCorrect) {
    this.players.forEach(p => {
      p.sendEnterCode(isCorrect);
    })
  }

  sendManualCode() {
    this.players.forEach(p => {
      p.sendManualCode(this.allCode);
    });
  }

  disconnectAll() {
    this.players.forEach(p => {
      p.disconnectPlayer();
    });
  }

  // helpers

  getAnyActivePlayer() {
    for (let i = 0; i < this.players.length; ++i) {
      if (this.players[i].isConnected()) {
        return this.players[i];
      }
    }
    return false;
  }

  getGameState() {
    const player = this.getAnyActivePlayer();
    console.log({ player });
    if (!player) {
      return {}
    }
    return player.gameState;
  }
}

export { RoomModel, PLAYER_NAMES };