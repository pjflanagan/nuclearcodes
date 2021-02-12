
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

  // TODO: function for if the count drops add a new player
  // function to remove all players at the end of the test to ensure room deletion
}

export { FullAutoRoomModel };