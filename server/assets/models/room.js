
import { PlayerModel } from './player.js';

class RoomModel {
  constructor() {
    this.roomName = '';
    this.players = [];
  }

  startRoom(roomName, playerCount) {
    this.roomName = roomName;
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(new PlayerModel(this, `player00${i}`));
    }
  }
}

export { RoomModel };