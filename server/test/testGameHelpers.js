
import assert from 'assert';

import {
  makeCode,
  makeFakeCode,
  calcSpyCount,
  mostCommonCode,
  stringDiff
} from '../src/game/gameHelpers.js';

describe('gameRoomHelpers.js', function () {
  describe('code, fakeCode', function () {
    it('should never have same letter at same index, try 100 times', function () {
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

  describe('calcSpyCount', function () {
    const SPY_COUNTS = [-1, -1, -1, -1, -1, 2, 2, 3, 3, 4, 4];
    for (let i = 5; i <= 10; ++i) {
      it(`should make ${SPY_COUNTS[i]} spies when ${i} players`, function () {
        assert.strictEqual(calcSpyCount(i), SPY_COUNTS[i]);
      })
    }
  });


  describe('stringDiff', function () {
    it('should return ABC - ADE = DE', function () {
      assert.strictEqual(stringDiff('ABC', 'ADE'), 'DE');
    });
    it('should return ABC - DEF = DEF', function () {
      assert.strictEqual(stringDiff('ABC', 'DEF'), 'DEF');
    });
    it(`should return ABC - ABC = ''`, function () {
      assert.strictEqual(stringDiff('ABC', 'ABC'), '');
    });
  });

  describe('mostCommonCode', function () {
    function makeResponses(arr) {
      const responses = [];
      arr.forEach(code => {
        responses.push({ code });
      });
      return responses;
    }
    it('should return most common code ABCD', function () {
      assert.strictEqual(
        mostCommonCode(
          makeResponses(['ABCD', 'ABCD', 'ABCD', 'DEFG', 'DEFG'])
        ).code, 'ABCD'
      )
    });
    it('should return highest index, equally common code ADFG', function () {
      assert.strictEqual(
        mostCommonCode(
          makeResponses(['ABCD', 'ABCD', 'ADFG', 'ADFG'])
        ).code, 'ADFG'
      )
    });
    it('should return most common code PQRS', function () {
      assert.strictEqual(
        mostCommonCode(
          makeResponses(['PQRS', 'ABCD', 'PQRS', 'LMNO'])
        ).code, 'PQRS'
      )
    });
    it('should return highest index, equally common code LMNO', function () {
      assert.strictEqual(
        mostCommonCode(
          makeResponses(['ABCD', 'DEFG', 'HIJK', 'LMNO'])
        ).code, 'LMNO'
      )
    });
    it('should return most common code ABCD', function () {
      assert.strictEqual(
        mostCommonCode(
          makeResponses(['ABCD', 'LMNO', 'HIJK', 'ABCD', 'ABCD', 'LMNO', 'WXYZ'])
        ).code, 'ABCD'
      )
    });
  });
});

