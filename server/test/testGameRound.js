
import assert from 'assert';

import {
  stringDiff,
  mostCommonCode
} from '../src/game/gameRound.js';

// TODO:
// function makeTestPlayers() {
//   const players;
//   return players;
// };

describe('gameRound.js Global', function () {
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
  })
});


// TODO:
// describe('gameRound.js RoundLobbyHandlers', function () {
//   describe('RoundLobbyHandlers.isPollOver', function () {

//   });
// });