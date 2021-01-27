


// The rooms host is just user[0]
// not sure what the host will do anymore

const GAME_STATES = {
  LOBBY: 0, // after here we will set spies and game code, introduce the rules
  ROUND_VOTE: 1, // vote on which room to go into
  ROUND_TURN_KEY: 2, // vote on which key to turn
  ROUND_ENTER_CODE: 3, // enter a code into the game
  GAME_OVER: 4 // ask if they'd like to play again
};

const MAX_PLAYERS = 6;
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
      response: {},
      isSpy: false
      // name: ''
    });
  }

  disconnect(socket) {
    this.players = this.players.filter(u => u.id !== socket.id);
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
    const arr = makeRandomArray(2, MAX_PLAYERS);
    arr.forEach(i => {
      if (!!this.players[i]) {
        this.players[i].isSpy = true;
      }
    });
    this.players[0].isSpy = true; // TODO: this is for DEBUGGING
    this.code = makeCode(6);
    this.fakeCode = makeFakeCode(this.code, 6);
  }

  pollResponse(socket, response) {
    const player = this.findPlayer(socket);

    switch (response.type) {
      case 'ready-up':
        player.response = response.data;

    }

    this.socketServer.updateGameState(this.name, this.getState());

    // TODO: somethere here with logging the response
    // and validating it
    // TODO: how will we do room picking, is it a free for all
    // or should one agent get voted on and then they do it?

    if (this.isPollOver()) {
      this.moveGameState();
    }
  }

  isPollOver() {
    // TODO: change this
    // return this.responses.length >= this.players.length;
    return true;
  }

  moveGameState() {
    this.clearResponses();
    switch (this.gameState) {
      case GAME_STATES.LOBBY:
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.setupGame();
        this.socketServer.nextSlide(this.name, {
          slideID: 'introduction' // leads to vote
        });
        break;
      case GAME_STATES.ROUND_ENTER_CODE:
        // TODO: switch here if they are correct
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
        break;
    }
    this.socketServer.updateGameState(this.name, this.getState());
  }

  // HELPERS

  getState() {
    const gameState = {
      players: this.players,
    };
    return gameState;
  }

  clearResponses() {
    this.players.forEach(p => p.response = {});
  }

  findPlayer(socket) {
    return this.players.find(p => p.id === socket.id)
  }

  isStarted() {
    return this.gameState !== GAME_STATES.LOBBY;
  }

  isFull() {
    return this.players.length >= 6;
  }

  isEmpty() {
    return this.players.length === 0;
  }
}

export { GameRoom };