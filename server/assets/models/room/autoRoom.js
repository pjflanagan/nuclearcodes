
import { RoomModel, PLAYER_NAMES } from './room.js';
import { AutoPlayerModel } from '../player/autoPlayer.js';

// TODO: this should extend room
class AutoRoomModel extends RoomModel {
  makePlayers(playerCount) {
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

  // getRoomIDThisRound(round, playerIndex) {
  //   return ROUND_ROOMS[round][playerIndex];
  // }
}

export { AutoRoomModel };