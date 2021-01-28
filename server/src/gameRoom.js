import { response } from "express";

const GAME_STATES = {
  LOBBY: 'LOBBY', // after here we will set spies and game code, introduce the rules
  ROUND_VOTE: 'ROUND_VOTE', // vote on which room to go into
  ROUND_TURN_KEY: 'ROUND_TURN_KEY', // vote on which key to turn
  ROUND_ENTER_CODE: 'ROUND_ENTER_CODE', // enter a code into the game
  // TODO: no round game over, just move them to a gameover slide -> credits -> play again prompt -> lobby
};

const PLAYERS_PER_GAME = 8;
const SPIES_PER_GAME = 2;
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

    console.log(player);

    // if a player responds to a poll we are not polling, then ignore
    if (response.type !== this.gameState) {
      console.error(`gameRoom.pollResponse: Not currently polling for '${response.type}', gameState is ${this.gameState}.`);
      // TODO: error for user
      return;
    }

    switch (response.type) {
      case GAME_STATES.LOBBY:
      case GAME_STATES.ROUND_TURN_KEY:
      case GAME_STATES.ROUND_ENTER_CODE:
        // just record the response they give here
        player.response = response.data;
        break;
      case GAME_STATES.ROUND_VOTE:
        // TODO: validate room choice
        // kick third player out of room if are also on the room
        // base this off of response time, latest response gets kicked?
        // or player that was clicked on gets kicked?
        player.response = response.data;
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
      case GAME_STATES.LOBBY:
        const responses = this.players.map(p => p.response);
        if (this.players.length < PLAYERS_PER_GAME) {
          return false;
        } else if (responses.filter(r => r !== false).length < this.players.length) {
          return false;
        }
        return true;

      // if they are voting for rooms
      case GAME_STATES.ROUND_VOTE:
        // TODO: validate that everyone is in a room
        break;

      case GAME_STATES.ROUND_TURN_KEY:
        // TODO: validate the spies have replied
        break;

      case GAME_STATES.ROUND_ENTER_CODE:
        // TODO: validate all players have entered
        break;

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
        // FIXME: was this necessary? this.socketServer.updateGameState(this.name, this.getState());
        // I had it here so I could display who has not readied up
        this.socketServer.nextSlide(this.name, {
          slideID: 'introduction' // leads to vote
        });
        break;


      case GAME_STATES.ROUND_VOTE:
        this.gameState = GAME_STATES.ROUND_TURN_KEY;
        // TODO: send each socket the data about which room they are in
        // and who they are in with, make them wait for ALL the spies to turn keys
        // do not clear data here as we will use it after the spies turn the keys
        break;

      case GAME_STATES.ROUND_TURN_KEY:
        this.gameState = GAME_STATES.ROUND_ENTER_CODE;
        // TODO: for each room, respond to the people in that room with the letter
        // they are supposed to see
        this.clearResponses();
        break;

      // if we are 
      case GAME_STATES.ROUND_ENTER_CODE:
        // TODO: switch here if they are correct
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