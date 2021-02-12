
import { AutoPlayerModel } from './autoPlayer.js'

class FullAutoPlayerModel extends AutoPlayerModel {

  makeListeners() {
    this.gamesPlayed = 0;
    this.socket.on('NEXT_SLIDE', (data) => {
      // TODO: set a timeout here before moving on?
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
          // enter a code right away
          this.sendEnterCode(Math.random() > 0.5);
          break;
        case 'start-next-round':
          // choose room
          this.sendRoomChoice();
          break;
        case 'gameover':
          // ready up
          this.gamesPlayed += 1;
          if (this.gamesPlayed < 100) {
            this.sendReadyUp();
          }
          break;
        default:
          console.error('unaccounted for state');
      }
      this.$scope.$apply();
    });

    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
      this.$scope.$apply();
    });

    this.socket.on('SET_ERRORS', data => {
      this.errors = data.errors;
      this.$scope.$apply();
    });

  }

}

export { FullAutoPlayerModel }