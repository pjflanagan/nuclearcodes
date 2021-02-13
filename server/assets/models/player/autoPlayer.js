
import { PlayerModel } from './player.js'

class AutoPlayerModel extends PlayerModel {

  makeListeners() {
    this.socket.on('NEXT_SLIDE', (data) => {
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
          this.sendRandomRoom();
          break;
        case 'letter-reveal':
          // do nothing here, wait for player response
          // player should decide if the game will continue
          break;
        case 'start-next-round':
          // choose room
          this.sendRandomRoom();
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
  }

  login() {
    this.socket.emit('JOIN_ROOM', {
      roomName: this.room.roomName
    });
  }

}

export { AutoPlayerModel }