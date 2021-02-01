
import {
  GAME_STATES,
  PLAYERS_PER_GAME,
  SPIES_PER_GAME,
  CODE_LENGTH,
  TOTAL_ROUNDS,
  makeCode,
  makeFakeCode,
  makeRandomArray
} from './gameHelpers.js';
import {
  RoundLobbyHandlers,
  RoundTurnKeyHandlers,
  RoundVoteHandlers,
  RoundEnterCodeHandlers
} from './gameRound.js';
import { PlayerList } from './playerModel.js';

class GameRoom {
  constructor(socketServer, roomName) {
    this.socketServer = socketServer;
    this.name = roomName;

    // game state
    this.players = new PlayerList();
    this.prevRooms = [];
    this.gameState = GAME_STATES.LOBBY;
    this.round = 0;

    // server side
    this.code = [];
    this.fakeCode = [];

    this.setupGame = this.setupGame.bind(this);
    this.moveGameState = this.moveGameState.bind(this);
  }

  // ADMIN

  joinRoom(socket) {
    this.players.addPlayer(socket);
  }

  disconnect(socket) {
    this.players.removePlayer(socket);
    // update the game state so people know they left
    this.socketServer.updateGameState(this.name, this.getState());
    // if this changes a poll response then re-check
    this.moveIfPollOver();
  }

  setPlayerName(socket, playerName) {
    return this.players.setPlayerName(socket, playerName);
  }

  // GAMEPLAY

  // make a game with spies, agents
  setupGame() {
    // reset the players if new game
    this.round = 0;
    this.players.resetSpies()
    const arr = makeRandomArray(SPIES_PER_GAME, PLAYERS_PER_GAME);
    arr.forEach(i => {
      const player = this.players.get(i);
      if (!!player) {
        player.setIsSpy(true);
      }
    });
    // make a code and a fake code that share no letters
    this.code = makeCode(CODE_LENGTH);
    this.fakeCode = makeFakeCode(this.code, CODE_LENGTH);
  }

  // players respond to polls and the data gets recorded here
  pollResponse(socket, response) {
    const player = this.players.findPlayer(socket);

    // if a player responds to a poll we are not polling, then ignore
    if (response.type !== this.gameState) {
      console.error(`gameRoom.pollResponse: Not currently polling for '${response.type}', gameState is ${this.gameState}.`);
      // TODO: error for user
      return;
    }

    switch (response.type) {
      case GAME_STATES.LOBBY:
      case GAME_STATES.ROUND_ENTER_CODE:
        // just record the response they give here
        player.recordResponse(response.data);
        break;
      case GAME_STATES.ROUND_TURN_KEY:
        RoundTurnKeyHandlers.pollResponse(player, response);
        break;
      case GAME_STATES.ROUND_VOTE:
        RoundVoteHandlers.pollResponse(player, this.players, response);
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
      case GAME_STATES.ROUND_VOTE:
        return RoundVoteHandlers.isPollOver(this.players);

      // if they are turning keys, make sure all the spies have responded
      case GAME_STATES.ROUND_TURN_KEY:
        return RoundTurnKeyHandlers.isPollOver(this.players);

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
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.setupGame();
        // update the game state, it will name the spies
        this.socketServer.updateGameState(this.name, this.getState());
        this.socketServer.nextSlide(this.name, {
          slideID: 'introduction' // leads to vote
        });
        break;

      // if we have all picked rooms
      case GAME_STATES.ROUND_VOTE:
        this.gameState = GAME_STATES.ROUND_TURN_KEY;
        const { rooms } = data;
        // store this data so we can use it for key reveal and error checking
        this.prevRooms = rooms;

        // for each room
        this.prevRooms.forEach((room, i) => {
          // if it has no people in it, return
          if (room.length === 0) {
            return;
          }
          // send a message to each socket, that says who they are in the room with
          // send this prompt to everyone, even non spies, show different message for spies
          room.forEach(player => {
            this.socketServer.nextSlide(player.id, {
              slideID: 'key-room-prompt',
              data: {
                roomID: i,
                room // TODO: this could be named better, it's really roomPlayers
              }
            });
          })
        });
        break;

      // if we just turned keys
      case GAME_STATES.ROUND_TURN_KEY:
        this.gameState = GAME_STATES.ROUND_ENTER_CODE;
        const { spyResponses } = data;
        // for each room
        this.prevRooms.forEach((room, i) => {
          if (room.length === 0) {
            return;
          }

          let spyCount = 0;
          let spyVoteFake = false;
          // for each player in the room
          room.forEach(player => {
            // if the player is a spy
            if (player.getIsSpy()) {
              // count up the number of spies
              spyCount++;
              const spyResponse = spyResponses.find(r => r.playerID === player.id);
              // if the respond to use the spy key
              if (!!spyResponse && !!spyResponse.response && spyResponse.response.isSpyKey) {
                // record so we can show the fake vote
                spyVoteFake = true;
              }
            }
          });

          // if the room has no spies: reveal the correct code
          let showWhichLetter = 'REAL';
          switch (spyCount) {
            case 2:
              // if the room has two spies: reveal both
              showWhichLetter = 'BOTH';
              break;
            case 1:
              // if the room has one spy: reveal what the spy said
              if (spyVoteFake) {
                showWhichLetter = 'FAKE';
              }
              break;
          }
          room.forEach(player => {
            // for each player in the room reveal the letter they are supposed to see
            this.socketServer.nextSlide(player.id, {
              slideID: 'letter-reveal',
              data: {
                roomID: i,
                realLetter: this.code[i],
                fakeLetter: this.fakeCode[i],
                showWhichLetter
              }
            })
          })
        })
        break;

      // if we just entered codes
      case GAME_STATES.ROUND_ENTER_CODE:
        this.round += 1;
        this.socketServer.updateGameState(this.name, this.getState()); // increment the rounds and clear responses
        const { codeResponses } = data;
        const numCorrect = codeResponses.reduce((sum, r) => (r.code.toUpperCase() === this.code ? sum + 1 : sum), 0);
        // if they are correct: ROUND_LOBBY, 'victory'
        if (numCorrect > this.players.count() / 2) {
          this.gameState = GAME_STATES.LOBBY;
          this.socketServer.nextSlide(this.name, {
            slideID: 'gameover',
            data: {
              result: 'victory',
              code: this.code
            }
          });
          return;
        }
        // if they are wrong and it is round 5: ROUND_LOBBY, 'gameover'
        if (this.round === TOTAL_ROUNDS) {
          this.gameState = GAME_STATES.LOBBY;
          this.socketServer.nextSlide(this.name, {
            slideID: 'gameover',
            data: {
              result: 'defeat',
              code: this.code
            }
          });
          return;
        }
        // otherwise: ROUND_VOTE, 'start-next-round'
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.socketServer.nextSlide(this.name, {
          slideID: 'start-next-round'
        });
        break;

      default:
        console.error(`gameRoom.moveGameState: gameState '${this.gameState}' not accounted for in moveGameState.`);
        break;
    }
  }

  // HELPERS

  getState() {
    const gameState = {
      players: this.players.getPlayersAsData(),
      // code: this.code, // it might be helpful to send these for tests
      // fakeCode: this.fakeCode
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
    return this.players.count() >= PLAYERS_PER_GAME;
  }

  isEmpty() {
    return this.players.count() === 0;
  }
}

export { GameRoom };