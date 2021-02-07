
import {
  GAME_STATES,
  MAX_PLAYERS_PER_GAME,
  TOTAL_ROUNDS,
  makeCode,
  makeFakeCode,
  makeRandomArray
} from './gameHelpers.js';
import {
  RoundLobbyHandlers,
  RoundChooseRoomHandlers,
  RoundEnterCodeHandlers
} from './gameRound.js';
import { PlayerList } from './playerModel.js';

class GameRoom {
  constructor(socketServer, roomName) {
    this.socketServer = socketServer;
    this.name = roomName;

    // game state
    this.players = new PlayerList();
    this.gameState = GAME_STATES.LOBBY;
    this.round = 0;
    this.codeLength = 0;
    this.code = [];
    this.fakeCode = [];
    this.spyCount = 0;

    this.setupGame = this.setupGame.bind(this);
    this.moveGameState = this.moveGameState.bind(this);
  }

  // ADMIN

  joinRoom(socket) {
    this.players.addPlayer(socket);
  }

  disconnect(socket) {
    // TODO: removing a player should not mean removing them from the list
    // it needs to instead make the player a ghost and wait for someone
    // else to take over it's body
    const player = this.players.removePlayer(socket);
    // update the game state so people know they left
    this.socketServer.updateGameState(this.name, this.getState());
    // we won't move the gamestate if a player leaves, we need them to rejoin
    return player;
  }

  setPlayerName(socket, playerName) {
    return this.players.setPlayerName(socket, playerName);
  }

  // GAMEPLAY

  // make a game with spies, agents
  setupGame() {
    const playerCount = this.players.count();
    this.spyCount = Math.floor((playerCount - 1) / 2);

    // reset the rounds and round data
    this.round = 0;
    this.setupRound();
    // 5 or 6 players 2 spies
    // 7 or 8 players 3 spies
    // 9 o 10 players 4 spies

    // reset the players
    this.players.resetSpies();
    const arr = makeRandomArray(this.spyCount, playerCount);
    arr.forEach(i => {
      const player = this.players.get(i);
      if (!!player) {
        player.setIsSpy(true);
      }
    });

    this.socketServer.updateGameState(this.name, this.getState());
  }

  setupRound() {
    // change the code length if someone drops
    this.codeLength = this.players.count() - this.spyCount;
    // make a code and a fake code that share no letters
    this.code = makeCode(this.codeLength);
    this.fakeCode = makeFakeCode(this.code);

    this.socketServer.updateGameState(this.name, this.getState());
  }

  // players respond to polls and the data gets recorded here
  pollResponse(socket, response) {
    const player = this.players.findPlayer(socket);

    // if a player responds to a poll we are not polling, then ignore
    if (response.type !== this.gameState) {
      console.error(`GameRoom.pollResponse: Not currently polling for '${response.type}', gameState is ${this.gameState}.`);
      return;
    }

    switch (response.type) {
      case GAME_STATES.LOBBY:
      case GAME_STATES.ROUND_CHOOSE_ROOM:
        // just record the response they give here
        player.recordResponse(response.data);
        break;
      case GAME_STATES.ROUND_ENTER_CODE:
        player.recordResponse(response.data);
        break;
      default:
        console.error(`gameRoom.pollResponse: Response for poll '${response.type}' not recoginzed.`);
        return;
    }

    this.socketServer.updateGameState(this.name, this.getState());
    this.moveIfPollOver();
  }

  // simple function for moving the gamestate if the poll is over
  // and moving any data over with it
  moveIfPollOver() {
    const [isPollOver, data] = this.isPollOver();
    if (isPollOver) {
      this.moveGameState(data);
    }
  }

  // check if the poll is over
  isPollOver() {
    switch (this.gameState) {
      case GAME_STATES.LOBBY:
        return RoundLobbyHandlers.isPollOver(this.players)

      // if they are voting for rooms
      case GAME_STATES.ROUND_CHOOSE_ROOM:
        return RoundChooseRoomHandlers.isPollOver(this.codeLength, this.players);

      // if they are entering codes, make sure they all have responded
      case GAME_STATES.ROUND_ENTER_CODE:
        return RoundEnterCodeHandlers.isPollOver(this.players);

      // otherwise something is wrong with the gamestate
      default:
        console.error(`gameRoom.isPollOver: gameState '${this.gameState}' not accounted for in isPollOver.`);
        return false
    }
  }

  // move the gamestate forward, this happens when we are done a poll
  moveGameState(data) {
    this.clearResponses();
    switch (this.gameState) {
      // if we are all ready
      case GAME_STATES.LOBBY:
        this.gameState = GAME_STATES.ROUND_CHOOSE_ROOM;
        this.setupGame();
        // update the game state, it will name the spies
        this.socketServer.nextSlide(this.name, {
          slideID: 'introduction' // leads to vote
        });
        this.socketServer.updateGameState(this.name, this.getState());
        break;

      // if we have all picked rooms
      case GAME_STATES.ROUND_CHOOSE_ROOM:
        this.gameState = GAME_STATES.ROUND_ENTER_CODE;
        const { rooms } = data;
        RoundChooseRoomHandlers.moveGameState({
          rooms,
          socketServer: this.socketServer,
          code: this.code,
          fakeCode: this.fakeCode
        });
        this.socketServer.updateGameState(this.name, this.getState());
        break;

      // if we just entered codes
      case GAME_STATES.ROUND_ENTER_CODE:
        this.round += 1;
        const {
          guessedCode,
          charsCorrect
        } = RoundEnterCodeHandlers.moveGameState({
          codeResponses: data.codeResponses,
          code: this.code
        });

        // if they are correct: ROUND_LOBBY, 'victory'
        if (charsCorrect === this.code.length) {
          this.gameState = GAME_STATES.LOBBY;
          this.socketServer.nextSlide(this.name, {
            slideID: 'gameover',
            data: {
              result: 'victory',
              code: this.code,
              spies: this.players.getSpies()
            }
          });
          this.socketServer.updateGameState(this.name, this.getState()); // increment the rounds and clear responses
          return;
        }
        // if they are wrong and it is round 5: ROUND_LOBBY, 'gameover'
        if (this.round === TOTAL_ROUNDS) {
          this.gameState = GAME_STATES.LOBBY;
          this.socketServer.nextSlide(this.name, {
            slideID: 'gameover',
            data: {
              result: 'defeat',
              code: this.code,
              spies: this.players.getSpies()
            }
          });
          this.socketServer.updateGameState(this.name, this.getState()); // increment the rounds and clear responses
          return;
        }
        // otherwise: ROUND_CHOOSE_ROOM, 'start-next-round'
        this.setupRound();
        this.gameState = GAME_STATES.ROUND_CHOOSE_ROOM;
        this.socketServer.nextSlide(this.name, {
          slideID: 'start-next-round',
          data: {
            guessedCode,
            charsCorrect
          }
        });
        this.socketServer.updateGameState(this.name, this.getState()); // increment the rounds and clear responses
        break;

      default:
        console.error(`gameRoom.moveGameState: gameState '${this.gameState}' not accounted for in moveGameState.`);
        break;
    }
  }

  // HELPERS

  getState() {
    const gameState = {
      codeLength: this.codeLength,
      players: this.players.getPlayersAsData(),
      code: this.code,
      fakeCode: this.fakeCode,
      round: this.round
    };
    return gameState;
  }

  clearResponses() {
    this.players.clearResponses();
  }

  isStarted() {
    return this.gameState !== GAME_STATES.LOBBY;
  }

  isFull() {
    return this.players.count() >= MAX_PLAYERS_PER_GAME;
  }

  isEmpty() {
    return this.players.count() === 0;
  }
}

export { GameRoom };