
import assert from 'assert';

import {
  Player,
  PlayerList
} from '../src/game/playerModel.js';

import { makePlayerList, mSocket } from './mocks/mockPlayerList.js';

describe('playerModel.js', function () {

  // TODO: describe the login behavior by acutally logging
  // users in and out

  describe('PlayerList', function () {
    describe('addPlayer', function () {
      it('should add 6 players', function () {
        const playerList = makePlayerList(6);
        assert.strictEqual(playerList.count(), 6);
      });
    });
    describe('removePlayer', function () {
      let count = 6;
      const playerList = makePlayerList(count);
      it('should remove front player', function () {
        const player = playerList.removePlayer({ id: 'p0' });
        assert.strictEqual(player.id, 'p0');
        assert.strictEqual(playerList.count(), --count);
      });
      it('should remove back player', function () {
        const player = playerList.removePlayer({ id: 'p5' });
        assert.strictEqual(player.id, 'p5');
        assert.strictEqual(playerList.count(), --count);
      });
      it('should remove middle player', function () {
        const player = playerList.removePlayer({ id: 'p3' });
        assert.strictEqual(player.id, 'p3');
        assert.strictEqual(playerList.count(), --count);
      });
      it('should not remove non-existant player', function () {
        const player = playerList.removePlayer({ id: 'INVALID' });
        assert.strictEqual(player, undefined);
        assert.strictEqual(playerList.count(), count);
      });
    });

    describe('setPlayerName', function () {
      const playerList = new PlayerList();
      playerList.addPlayer(new Player(mSocket(0)));
      playerList.addPlayer(new Player(mSocket(1)));
      playerList.addPlayer(new Player(mSocket(2)));
      it('should set player name to JasonBourne', function () {
        const returnedPlayerName = playerList.setPlayerName({ id: 'p0' }, 'JasonBourne');
        assert.strictEqual(returnedPlayerName, 'JasonBourne');
        assert.strictEqual(playerList.findPlayer({ id: 'p0' }).name, 'JasonBourne');

      });
      it('should set player name to JasonBourne1', function () {
        const returnedPlayerName = playerList.setPlayerName({ id: 'p1' }, 'JasonBourne');
        assert.strictEqual(returnedPlayerName, 'JasonBourne1');
        assert.strictEqual(playerList.findPlayer({ id: 'p1' }).name, 'JasonBourne1');
      });
    });

    describe('setSpies', function () {
      const playerList = makePlayerList(8);
      it('should make 3 spies and 5 agents', function () {
        playerList.setSpies();
        assert.strictEqual(playerList.getSpyCount(), 3);
        assert.strictEqual(playerList.getAgentCount(), 5);
      });
      it('should add a player and make 4 spies and 5 agents', function () {
        playerList.addPlayer({ id: `new-1` });
        playerList.setPlayerName({ id: 'new-1' }, 'NewPlayer');
        playerList.setSpies();
        assert.strictEqual(playerList.getSpyCount(), 4);
        assert.strictEqual(playerList.getAgentCount(), 5);
      });
    });

    describe('createRoomArray', function () {

    });

    describe('sameRoomPlayers', function () {

    });

  });
});
