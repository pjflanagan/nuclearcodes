
import { PlayerModel } from './player.js';

const playerNames = [
  'James Bond',
  'Austin Powers',
  'Jason Bourne',
  'Ethan Hunt',
  'Alex Rider',
  'Black Widow',
  'Kim Possible',
  'MacGyver',
  'Carmen Cortez',
  'Archer'
];

class RoomModel {
  constructor($scope, roomName, playerCount) {
    this.$scope = $scope;
    this.roomName = roomName;
    this.roomURL = `${CLIENT_ENDPOINT}/${roomName}`;
    this.players = [];
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(new PlayerModel(this.$scope, this, playerNames[i]));
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
    this.players.forEach(p => {
      p.response.code = this.allCode;
      p.sendEnterCode();
    })
  }
}

export { RoomModel };