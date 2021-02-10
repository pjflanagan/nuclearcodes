
import { RoomModel, PLAYER_NAMES } from './room.js';
import { FullAutoPlayerModel } from '../player/fullAutoPlayer.js';

class FullAutoRoomModel extends RoomModel {
  makePlayers(playerCount) {
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(
        new FullAutoPlayerModel(
          this.$scope,
          this,
          PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)],
          i
        )
      );
    }
  }
}

export { FullAutoRoomModel };