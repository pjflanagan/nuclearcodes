
import { PlayerModel } from './player.js'

class AutoPlayerModel extends PlayerModel {

  makeListeners() {
    this.socket.on('NEXT_SLIDE', (data) => {
      this.lastSlideID = data.slideID;
      switch (data.slideID) {
        case 'name-prompt':
          // submit name
          this.submitName();
          break;
        case 'welcome-agent':
          // ready up
          this.sendReadyUp();
          break;
        case 'introduction':
          // choose room
          this.sendRoomChoice();
          break;
        case 'letter-reveal':
          // display revealed letter
          this.recvLetterReveal(data);
          break;
        case 'start-next-round':
          // choose room
          this.sendRoomChoice();
          break;
        case 'gameover':
          // ready up
          this.sendReadyUp();
          break;
        default:
          console.error('unaccounted for state');
      }
      this.$scope.$apply();
    });

    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
      // const playerInfo = this.getPlayerInfoFromGameState();
      // if (playerInfo.response === false) {
      //   // if the player is not in a room any more re-enter that room by sending again
      //   if (this.lastSlideID === 'introduction' || this.lastSlideID === 'start-next-round') {
      //     this.sendRoomChoice();
      //   }
      // }
      this.$scope.$apply();
    });

    this.socket.on('SET_ERRORS', data => {
      this.errors = data.errors;
      // if (data.type === 'GameRoom.pollResponse.ROUND_CHOOSE_ROOM') {
      //   // if we have an error entering the room, try and enter again
      //   this.sendRoomChoice();
      // }
      this.$scope.$apply();
    });

  }

  login() {
    this.socket.emit('JOIN_ROOM', {
      roomName: this.room.roomName
    });
  }

  sendRoomChoice() {
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_CHOOSE_ROOM',
      data: {
        roomID: Math.floor(Math.random() * this.gameState.codeLength),
        timestamp: Date.now()
      }
    });
  }

  recvLetterReveal(data) {
    this.lastSawLetter = `Real: ${data.realLetter} Fake: ${data.fakeLetter}`;
    this.$scope.$apply();
  }

}

export { AutoPlayerModel }