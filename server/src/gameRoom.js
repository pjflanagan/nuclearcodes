
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

class GameRoom {
  constructor(socketServer, roomName) {
    this.socketServer = socketServer;
    this.name = roomName;

    // game state
    this.players = [];
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
    this.players.push({
      id: socket.id,
      response: false,
      isSpy: false
      // name: ''
    });
  }

  disconnect(socket) {
    this.players = this.players.filter(u => u.id !== socket.id);
    // update the game state so people know they left
    this.socketServer.updateGameState(this.name, this.getState());
    // if this changes a poll response then re-check
    this.moveIfPollOver();
  }

  setPlayerName(socket, playerName, num = 0) {
    let playerSetName = (num > 0) ? `${playerName}${num}` : playerName;
    const player = this.findPlayer(socket);
    const existingPlayer = this.players.find(p => p.name === playerSetName);
    if (!!existingPlayer) {
      // if this player exists tack a number on
      return this.setPlayerName(socket, playerName, num + 1);
    }
    player.name = playerSetName;
    return playerSetName;
  }

  // GAMEPLAY

  // make a game with spies, agents
  setupGame() {
    // reset the players if new game
    this.players.forEach(p => p.isSpy = false);
    const arr = makeRandomArray(SPIES_PER_GAME, PLAYERS_PER_GAME);
    arr.forEach(i => {
      if (!!this.players[i]) {
        // set two players to be spies
        this.players[i].isSpy = true;
      }
    });
    // make a code and a fake code that share no letters
    this.code = makeCode(CODE_LENGTH);
    this.fakeCode = makeFakeCode(this.code, CODE_LENGTH);
  }

  // players respond to polls and the data gets recorded here
  pollResponse(socket, response) {
    const player = this.findPlayer(socket);

    // if a player responds to a poll we are not polling, then ignore
    if (response.type !== this.gameState) {
      console.error(`gameRoom.pollResponse: Not currently polling for '${response.type}', gameState is ${this.gameState}.`);
      // TODO: error for user
      return;
    }

    switch (response.type) {
      case GAME_STATES.LOBBY:
      case GAME_STATES.ROUND_ENTER_CODE:
        console.debug(response);
        // just record the response they give here
        player.response = response.data;
        break;
      case GAME_STATES.ROUND_TURN_KEY:
        // validate that they are a spy
        if (player.isSpy) {
          player.response = response.data;
        } else {
          console.error(`gameRoom.pollResponse: Response '${response.type}' recieved for agent, not spy.`);
        }
        break;
      case GAME_STATES.ROUND_VOTE:
        // kick third player out of room if are also on the room
        // based off of response time, latest response gets kicked
        // TODO: Validate here, they can't enter same room as last time
        const sameRoomPlayers = this.players.filter(p => p.response !== false && p.response.roomID === response.data.roomID);
        if (sameRoomPlayers.length > 1) {
          sameRoomPlayers.sort((a, b) => b.response.timestamp - a.response.timestamp);
          // TODO: validate here, they can't enter room with same parter as before

          sameRoomPlayers[0].response = false;
        }
        // or this could just happen on the front end
        player.response = response.data;
        this.socketServer.updateGameState(this.name, this.getState());
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
      // if they are readying up in the lobby
      // validate they have enough players and they are all ready
      case GAME_STATES.LOBBY:
        if (this.players.length < PLAYERS_PER_GAME) {
          return [false];
        }
        const lobbyResponses = this.players.map(p => p.response);
        if (lobbyResponses.filter(r => r !== false).length < this.players.length) {
          return [false];
        }
        return [true];

      // if they are voting for rooms
      case GAME_STATES.ROUND_VOTE:
        // validate that everyone is paired off in a room
        // TODO: everyone is in a pair they have not been in last round
        // TODO: everyone is in a room they haven't been in last round
        const rooms = Array(CODE_LENGTH).fill(new Array());
        this.players.forEach(player => {
          if (player.response !== false && player.response.roomID !== undefined) {
            rooms[player.response.roomID] = [...rooms[player.response.roomID], player];
          }
        });
        // console.debug(rooms);
        let hasInvalidRoom = false;
        let roomVoteResponseCount = 0;
        rooms.forEach((playersInRoom) => {
          const count = playersInRoom.length;
          roomVoteResponseCount += count;
          if (count % 2 !== 0 || count > 2) {
            // if not an even number (pair) or 0
            hasInvalidRoom = true;
          }
        });
        return [
          !hasInvalidRoom && roomVoteResponseCount >= this.players.length,
          { rooms }
        ];

      // if they are turning keys, make sure all the spies have responded
      case GAME_STATES.ROUND_TURN_KEY:
        const spies = this.players.filter(p => p.isSpy);
        const spyResponses = spies.map(spy => ({
          response: spy.response,
          playerID: spy.id
        }));
        // console.debug(spyResponses);
        if (spyResponses.filter(r => r.response !== false).length < spies.length) {
          // if the spies have not all responded
          // TODO: auto response here to keep game moving? maybe shouldn't happen here in code but we should have it in general
          return [false];
        }
        return [true, { spyResponses }];

      // if they are entering codes, make sure they all have responded
      case GAME_STATES.ROUND_ENTER_CODE:
        const codeResponses = this.players.map(p => p.response);
        if (codeResponses.filter(r => r !== false).length < this.players.length) {
          return [false];
        }
        return [true, codeResponses];

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
          room.forEach(player => {
            this.socketServer.nextSlide(player.id, {
              slideID: 'key-room',
              data: {
                roomID: i,
                room
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
            if (player.isSpy) {
              // count up the number of spies
              spyCount++;
              const spyResponse = spyResponses.find(r => r.playerID === player.id);
              // if the respond to use the spy key
              if (spyResponse.response.isSpyKey) {
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
        // TODO: switch here 
        console.debug(data);
        // if they are correct: ROUND_LOBBY, 'victory'
        // if they are wrong and it is round 5: ROUND_LOBBY, 'gameover'
        // otherwise: ROUND_VOTE, 'defcon'
        // might be vote to KILL?
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.socketServer.nextSlide(this.name, {
          slideID: 'defcon', // show the defcon before each round for fun, leads to vote
          data: {
            round: this.round
          }
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
      players: this.players,
      // code: this.code, // TODO: might be helpful to send these for tests
      // fakeCode: this.fakeCode
    };
    return gameState;
  }

  clearResponses() {
    this.players.forEach(p => p.response = false);
  }

  findPlayer(socket) {
    return this.players.find(p => p.id === socket.id)
  }

  isStarted() {
    return this.gameState !== GAME_STATES.LOBBY;
  }

  isFull() {
    return this.players.length >= PLAYERS_PER_GAME;
  }

  isEmpty() {
    return this.players.length === 0;
  }
}

export { GameRoom };