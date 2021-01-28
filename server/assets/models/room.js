
import { PlayerModel } from './player.js';

class RoomModel {
  constructor($scope, roomName, playerCount) {
    this.$scope = $scope;
    this.roomName = roomName;
    this.roomURL = `${CLIENT_ENDPOINT}/${roomName}`;
    this.players = [];
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(new PlayerModel(this.$scope, this, `player00${i}`));
    }
    this.allCode = '';
  }

  sendReadyUp() {
    this.players.forEach(p => {
      p.sendReadyUp();
    });
  }

  sendRoomChoices() {
    this.players.forEach((p, i) => {
      p.response.roomID = Math.floor(i / 2);
      p.sendRoomChoice();
    });
  }

  sendKeyChoices() {
    this.players.forEach(p => {
      p.response.keyChoice = (Math.random() > 0.5) ? 'spyKey' : 'agentKey';
      p.sendKeyChoice();
    });
  }

  sendEnterCode() {
    console.log(this.allCode);
    this.players.forEach(p => {
      p.response.code = this.allCode;
      p.sendEnterCode();
    })
  }
}

export { RoomModel };