
import assert from 'assert';

import {
  RoundLobbyHandlers
} from '../src/game/gameRound.js';

import { makePlayerList } from './testPlayerModel.js';

describe('gameRound.js', function () {
  describe('RoundLobbyHandlers', function () {
    describe('isPollOver', function () {
      it('should return false when not enough players', function () {
        const players = makePlayerList(2);
        assert.strictEqual(RoundLobbyHandlers.isPollOver(players)[0], false);
      });
      it('should return false not enough responses', function () {
        const players = makePlayerList(6);
        players.get(0).recordResponse(true);
        players.get(4).recordResponse(true);
        assert.strictEqual(RoundLobbyHandlers.isPollOver(players)[0], false);
      });
      it('should return false not enough responses', function () {
        const players = makePlayerList(6);
        for (let i = 0; i < players.count() - 1; ++i) {
          players.get(i).recordResponse(true);
        }
        assert.strictEqual(RoundLobbyHandlers.isPollOver(players)[0], false);
      });
      it('should return true when all players have responded', function () {
        const players = makePlayerList(6);
        for (let i = 0; i < players.count(); ++i) {
          players.get(i).recordResponse(true);
        }
        assert.strictEqual(RoundLobbyHandlers.isPollOver(players)[0], true);
      });
    });
  });

});