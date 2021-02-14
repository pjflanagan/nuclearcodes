
import assert from 'assert';


class MockServerSocket {
  constructor() {
    this.emits = []
  }

  // mock

  updateGameState(roomName, gameState) {
    this.emits.push({
      toID: roomName,
      event: 'GAME_STATE',
      data: gameState
    });
  }

  nextSlide(toID, data) {
    this.emits.push({
      toID,
      event: 'NEXT_SLIDE',
      data
    });
  }

  // test

  checkEmits({ emitIndex, toID, event, dataKey, dataValue, slideData, slideDataValue }) {
    const emit = this.emits[emitIndex];
    assert.strictEqual(emit.toID, toID);
    if (!!event) {
      assert.strictEqual(emit.event, event);
    }
    if (!!dataKey && !!dataValue) {
      assert.strictEqual(emit.data[dataKey], dataValue);
    }
    if (!!slideData) {
      assert.strictEqual(emit.data.data[slideData], slideDataValue);
    }
  }

  getEmit(emitIndex) {
    return this.emits[emitIndex];
  }
}

export { MockServerSocket }