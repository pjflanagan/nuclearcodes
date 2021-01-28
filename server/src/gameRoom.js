
const GAME_STATES = {
  LOBBY: 'LOBBY', // after here we will set spies and game code, introduce the rules
  ROUND_VOTE: 'ROUND_VOTE', // vote on which room to go into
  ROUND_TURN_KEY: 'ROUND_TURN_KEY', // vote on which key to turn
  ROUND_ENTER_CODE: 'ROUND_ENTER_CODE', // enter a code into the game
  // TODO: no round game over, just move them to a gameover slide -> credits -> play again prompt -> lobby
};

const PLAYERS_PER_GAME = 8;
const SPIES_PER_GAME = 3;
const CODE_LENGTH = 5;
const CHARSET = 'BCDFGHJKLMNPQRSTVWXYZ';

const makeRandomArray = (length, range) => {
  var arr = [];
  while (arr.length < length) {
    let c = Math.floor(Math.random() * range);
    if (arr.indexOf(c) === -1) arr.push(c);
  }
  return arr;
}

const makeCode = (codeLength, charset = CHARSET) => {
  const arr = makeRandomArray(codeLength, charset.length);
  return arr.map(c => charset[c]).join('');
}

const makeFakeCode = (realCode) => {
  const fakeCharset = CHARSET.split(realCode).join('')
  return makeCode(realCode.length, fakeCharset);
}

class GameRoom {
  constructor(socketServer, roomName) {
    this.socketServer = socketServer;
    this.name = roomName;

    // game state
    this.players = [];
    this.roomPairs = [];
    this.gameState = GAME_STATES.LOBBY;
    this.round = 0;

    // server side
    this.code = [];
    this.fakeCode = [];

    this.setupGame = this.setupGame.bind(this);
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
    if (this.isPollOver()) {
      this.moveGameState();
    }
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

  setupGame() {
    const arr = makeRandomArray(SPIES_PER_GAME, PLAYERS_PER_GAME);
    arr.forEach(i => {
      if (!!this.players[i]) {
        this.players[i].isSpy = true;
      }
    });
    this.code = makeCode(CODE_LENGTH);
    this.fakeCode = makeFakeCode(this.code, CODE_LENGTH);
  }

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
      case GAME_STATES.ROUND_TURN_KEY: // TODO: validate that they are a spy?
      case GAME_STATES.ROUND_ENTER_CODE:
        // just record the response they give here
        player.response = response.data;
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
        return false;
    }

    this.socketServer.updateGameState(this.name, this.getState());

    if (this.isPollOver()) {
      this.moveGameState();
    }
  }

  // check if the poll is over
  isPollOver() {

    switch (this.gameState) {
      // if they are readying up in the lobby
      // validate they have enough players and they are all ready
      case GAME_STATES.LOBBY:
        const lobbyResponses = this.players.map(p => p.response);
        if (this.players.length < PLAYERS_PER_GAME) {
          return false;
        } else if (lobbyResponses.filter(r => r !== false).length < this.players.length) {
          return false;
        }
        return true;

      // if they are voting for rooms
      case GAME_STATES.ROUND_VOTE:
        // validate that everyone is paired off in a room
        // TODO: everyone is in a pair they have not been in last round
        // TODO: everyone is in a room they haven't been in last round
        const roomCount = [...Array(CODE_LENGTH)].fill(0);
        console.log(roomCount);
        const roomVoteResponses = this.players.map(p => p.response);
        roomVoteResponses.forEach(response => {
          if (response.roomID !== undefined) {
            roomCount[response.roomID]++;
          }
        });
        console.log(roomCount);
        let hasInvalidRoom = false;
        let roomVoteResponseCount = 0;
        roomCount.forEach((count) => {
          roomVoteResponseCount += count;
          if (count % 2 !== 0 || count > 2) {
            // if not an even number (pair) or 0
            hasInvalidRoom = true;
          }
        });
        console.log({ hasInvalidRoom, roomVoteResponseCount })
        return !hasInvalidRoom && roomVoteResponseCount >= this.players.length;

      // if they are turning keys, make sure all the spies have responded
      case GAME_STATES.ROUND_TURN_KEY:
        const spies = this.players.filter(p => p.isSpy);
        const spyResponses = spies.map(p => p.response);
        if (spyResponses.filter(r => r !== false).length < spies.length) {
          // if the spies have not all responded
          return false;
        }
        return true;

      // if they are entering codes, make sure they all have responded
      case GAME_STATES.ROUND_ENTER_CODE:
        const codeResponses = this.players.map(p => p.response);
        if (codeResponses.filter(r => r !== false).length < this.players.length) {
          return false;
        }
        return true;

      // otherwise something is wrong with the gamestate
      default:
        console.error(`gameRoom.isPollOver: gameState '${this.gameState}' not accounted for in isPollOver.`);
        return false
    }
  }

  // move the gamestate forward
  // this happens when we are done a poll
  moveGameState() {
    switch (this.gameState) {
      // if we are leaving the lobby
      case GAME_STATES.LOBBY:
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.clearResponses();
        this.setupGame();
        // update the game state, it will name the spies
        this.socketServer.updateGameState(this.name, this.getState());
        this.socketServer.nextSlide(this.name, {
          slideID: 'introduction' // leads to vote
        });
        break;

      case GAME_STATES.ROUND_VOTE:
        this.gameState = GAME_STATES.ROUND_TURN_KEY;
        // TODO: send each socket the data about which room they are in
        // and who they are in with, make them wait for ALL the spies to turn keys
        // move the data from the responses into the this.roomPairs
        break;

      case GAME_STATES.ROUND_TURN_KEY:
        this.gameState = GAME_STATES.ROUND_ENTER_CODE;
        // TODO: for each room, respond to the people in that room with the letter
        // they are supposed to see
        this.clearResponses();
        break;

      // if we are 
      case GAME_STATES.ROUND_ENTER_CODE:
        // TODO: switch here 
        // if they are correct: ROUND_LOBBY, 'victory'
        // if they are wrong and it is round 5: ROUND_LOBBY, 'gameover'
        // otherwise: ROUND_VOTE, 'defcon'
        // might be vote to KILL?
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.clearResponses();
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