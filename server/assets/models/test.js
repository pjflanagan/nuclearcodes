
import { PlayerModel } from './player.js';

class TestModel {
  constructor() {
    this.players = [];
  }

  startTest(startTest, playerCount) {
    for (let i = 0; i < playerCount; ++i) {
      this.players.push(new PlayerModel(startTest, `player00${i}`));
    }
  }
}

export { TestModel };