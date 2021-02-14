
import assert from 'assert';

import {
  RoundLobbyHandlers,
  RoundChooseRoomHandlers,
  RoundEnterCodeHandlers
} from '../src/game/gameRound.js';

import { MockServerSocket } from './mocks/mockServerSocket.js';

import { makePlayerList } from './testPlayerModel.js';

describe('gameRound.js', function () {

  // RoundLobbyHandlers
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
  // end RoundLobbyHandlers

  // RoundChooseRoomHandlers
  describe('RoundChooseRoomHandlers', function () {
    let allInSameRoomRooms = [];
    let twoPerEachRoomRooms = [];
    describe('isPollOver', function () {
      it('should return false, not enough responses', function () {
        const players = makePlayerList(6);
        players.get(0).recordResponse({ roomID: 1 });
        players.get(4).recordResponse({ roomID: 2 });
        const [isPollOver, { rooms }] = RoundChooseRoomHandlers.isPollOver(3, players);
        assert.strictEqual(isPollOver, false);
        assert.strictEqual(rooms[1].length, 1);
        assert.strictEqual(rooms[2].length, 1);
      });
      it('should return true, all in room 1', function () {
        const players = makePlayerList(6);
        for (let i = 0; i < players.count(); ++i) {
          players.get(i).recordResponse({
            roomID: 1
          });
        }
        const [isPollOver, { rooms }] = RoundChooseRoomHandlers.isPollOver(3, players);
        assert.strictEqual(isPollOver, true);
        assert.strictEqual(rooms[1].length, 6);
        allInSameRoomRooms = rooms;
      });
      it('should return true, 2 players per room', function () {
        const players = makePlayerList(6);
        for (let i = 0; i < players.count(); ++i) {
          players.get(i).recordResponse({
            roomID: i % 3
          });
        }
        const [isPollOver, { rooms }] = RoundChooseRoomHandlers.isPollOver(3, players);
        assert.strictEqual(isPollOver, true);
        for (let i = 0; i < rooms.length; ++i) {
          assert.strictEqual(rooms[i].length, 2);
        }
        twoPerEachRoomRooms = rooms;
      });
      // what about players claiming rooms not in roomCount?
      // what about incorrectly formatted responses?
    });

    describe('moveGameState', function () {
      it('should emit to all players the same letters', function () {
        const socketServer = new MockServerSocket();
        const code = "ABC";
        const fakeCode = "DEF";
        RoundChooseRoomHandlers.moveGameState({
          rooms: allInSameRoomRooms,
          code, fakeCode, socketServer
        });
        for (let i = 0; i < 6; ++i) {
          socketServer.checkEmits({
            emitIndex: i,
            toID: `p${i}`,
            dataKey: 'slideID',
            dataValue: 'letter-reveal',
            slideDataKey: 'realLetter',
            slideDataValue: 'B'
          });
        }
      });

      it('should emit letters to players in pairs', function () {
        const socketServer = new MockServerSocket();
        const code = "ABC";
        const fakeCode = "DEF";
        RoundChooseRoomHandlers.moveGameState({
          rooms: twoPerEachRoomRooms,
          code, fakeCode, socketServer
        });
        const playerMessagedOrder = [0, 3, 1, 4, 2, 5];
        for (let i = 0; i < 6; ++i) {
          const playerMessaged = playerMessagedOrder[i]
          socketServer.checkEmits({
            emitIndex: i,
            toID: `p${playerMessaged}`,
            dataKey: 'slideID',
            dataValue: 'letter-reveal',
            slideDataKey: 'realLetter',
            slideDataValue: code[playerMessaged % 3]
          });
        }
      })
    });
  });
  // end RoundChooseRoomHandlers

  describe('RoundLobbyHandlers', function () {
    describe('isPollOver', function () {
      it('should return false when not enough responses', function () {
        const players = makePlayerList(6);
        for (let i = 0; i < players.count() - 3; ++i) {
          players.get(i).recordResponse({ code: 'ABC' });
        }
        assert.strictEqual(RoundEnterCodeHandlers.isPollOver(players)[0], false);
      });

      it('should return true, should return agent responses only', function () {
        const players = makePlayerList(6);
        for (let i = 0; i < players.count(); ++i) {
          players.get(i).recordResponse({ code: 'ABC' });
        }
        players.get(1).setIsSpy(true);
        players.get(4).setIsSpy(true);
        const [isPollOver, { codeResponses }] = RoundEnterCodeHandlers.isPollOver(players);
        assert.strictEqual(isPollOver, true);
        assert.strictEqual(codeResponses.length, 4);
      });
    });

    describe('moveGameState', function () {
      it('should return ABC, 0', function () {
        const code = 'DEF'
        const codeResponses = [{ code: 'ABC' }, { code: 'ABC' }]
        const {
          guessedCode,
          charsCorrect
        } = RoundEnterCodeHandlers.moveGameState({
          codeResponses, code
        });
        assert.strictEqual(guessedCode, 'ABC');
        assert.strictEqual(charsCorrect, 0);
      })
    });
  });
  // end RoundLobbyHandlers

  // end gameRound.js
});
