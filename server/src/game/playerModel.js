
import {
  makeRandomArray,
  calcSpyCount
} from './gameHelpers.js';

// a player object that represents a player
class Player {
  constructor({ id }) {
    this.id = id;
    this.isSpy = false;
    this.response = false;
    this.name = '';
  }

  // NAME

  setName(name) {
    this.name = name;
  }

  // SPY

  setIsSpy(isSpy) {
    this.isSpy = isSpy;
  }

  getIsSpy() {
    return this.isSpy;
  }

  // RESPONSE

  hasResponse() {
    return !!this.response;
  }

  recordResponse(data) {
    this.response = data;
  }

  unsetResponse() {
    this.response = false;
  }

  asData() {
    return {
      isSpy: this.isSpy,
      name: this.name,
      id: this.id,
      response: this.response
    };
  }
}

// Player list is an array wrapper that
// contains functions to help with the management of multiple players
class PlayerList {
  constructor() {
    this.players = [];
  }

  // ADMIN

  addPlayer(socket) {
    this.players.push(new Player({
      id: socket.id
    }));
  }

  removePlayer(socket) {
    // TODO: this should just set them as a ghost
    // in the event that they rejoin?, must rejoin with same name
    // move them into a ghosts array
    const player = this.findPlayer(socket);
    this.players = this.players.filter(p => p.id !== socket.id);
    return player;
  }

  setPlayerName(socket, playerName, num = 0) {
    let playerSetName = (num > 0) ? `${playerName}${num}` : playerName;
    const player = this.findPlayer(socket);
    const existingPlayer = this.players.find(p => p.name === playerSetName);
    if (!!existingPlayer) {
      // if this player exists tack a number on
      return this.setPlayerName(socket, playerName, num + 1);
    }
    player.setName(playerSetName);
    return playerSetName;
  }

  // SPY LOGIC

  resetSpies() {
    this.players.forEach(p => p.setIsSpy(false));
  }

  setSpies() {
    // reset the spies
    this.resetSpies();

    // calculate how many spies we should have and make a random array
    const spyCount = calcSpyCount(this.count());
    const arr = makeRandomArray(spyCount, this.count());

    // for each in the array, set those players to be spies
    arr.forEach(i => {
      const player = this.players[i];
      if (!!player) {
        player.setIsSpy(true);
      }
    });
  }

  getSpies() {
    return this.players.filter(p => p.getIsSpy());
  }

  getSpyCount() {
    return this.getSpies().length
  }

  getAgentCount() {
    // agents = players - spies
    return this.count() - this.getSpyCount();
  }

  // ROOM LOGIC

  createRoomArray(roomCount) {
    const rooms = Array(roomCount).fill(new Array());
    this.players.forEach(player => {
      if (
        player.hasResponse() &&
        player.response.roomID !== undefined &&
        player.response.roomID < rooms.length
      ) {
        rooms[player.response.roomID] = [...rooms[player.response.roomID], player];
      }
    });
    return rooms;
  }

  sameRoomPlayers(roomID) {
    return this.players.filter(p => p.response !== false && p.response.roomID === roomID);
  }

  // RESPONSE LOGIC

  getResponses() {
    return this.players.map(p => p.response).filter(r => r !== false);
  }

  getAgentResponses() {
    return this.players.filter(p => !p.isSpy).map(p => p.response).filter(r => r !== false);
  }

  clearResponses() {
    this.players.forEach(p => p.response = false);
  }

  // ARRAY LOGIC

  get(i) {
    return this.players[i];
  }

  findPlayer(socket) {
    return this.players.find(p => p.id === socket.id);
  }

  count() {
    return this.players.length;
  }

  // DATA

  getPlayersAsData() {
    return this.players.map(p => p.asData());
  }
}

export {
  Player,
  PlayerList,

  // export for test
  calcSpyCount
}