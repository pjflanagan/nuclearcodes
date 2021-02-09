
import assert from 'assert';

import { makeCode, makeFakeCode } from '../src/game/gameHelpers.js';

describe('gameRoomHelpers.js', function () {
  describe('code, fakeCode', function () {
    it('should never have same letter at same index', function () {
      for (let i = 0; i < 100; ++i) {
        const code = makeCode(Math.floor(Math.random() * 10));
        const fakeCode = makeFakeCode(code);

        assert.strictEqual(code.length, fakeCode.length);
        for (let c = 0; c < code.length; ++c) {
          assert.strictEqual(code[c] === fakeCode[c], false);
        }
      }
    });
  });
});

