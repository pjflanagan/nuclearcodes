

import assert from 'assert';

import {
  GameRoom
} from '../src/game/gameRoom.js';

import { MockServerSocket } from './mocks/mockServerSocket.js';

import { makePlayerList } from './testPlayerModel.js';

describe('gameRoom.js', function () {
  describe('GameRoom', function () {

    describe('setupGame', function () {
      it('should emit gamestate with 2 spies and a code length 4 on setupGame', function () {
        const mockSocketServer = new MockServerSocket();
        const gameRoom = new GameRoom(mockSocketServer, 'test');
        gameRoom.players = makePlayerList(6);
        gameRoom.setupGame();
        mockSocketServer.checkEmits({
          emitIndex: 0,
          toID: 'test',
          event: 'GAME_STATE'
        });
        const { data: postSetupEmitData } = mockSocketServer.getEmit(0);

        let spyCount = 0;
        postSetupEmitData.players.forEach(function (player) {
          if (player.isSpy) {
            spyCount++;
          }
        })
        // assert more things here
        assert.strictEqual(postSetupEmitData.codeLength, 4);
        assert.strictEqual(postSetupEmitData.code.length, 4);
        assert.strictEqual(postSetupEmitData.fakeCode.length, 4);
        assert.strictEqual(postSetupEmitData.round, 0);
        assert.strictEqual(spyCount, 2);
      });
    });

  });
});
