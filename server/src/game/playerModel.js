
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

  // DATA

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
    this.connections = [];
    this.players = [];
    this.disconnects = [];
  }

  // ADMIN

  addPlayer(socket) {
    this.connections.push(new Player({
      id: socket.id
    }));
  }

  removePlayer(socket) {
    const player = this.findPlayer(socket);
    this.disconnects.push(player);
    this.players = this.players.filter(p => p.id !== socket.id);
    return player;
  }

  setPlayerName(socket, playerName, num = 0) {
    let playerSetName = (num > 0) ? `${playerName}${num}` : playerName;
    const player = this.findConnection(socket);
    const existingPlayer = this.players.find(p => p.name === playerSetName);
    if (!!existingPlayer) {
      // if this player exists tack a number on
      return this.setPlayerName(socket, playerName, num + 1);
    }
    player.setName(playerSetName);
    // after the player has set thier name, add them to the players list
    this.moveConnection(player);
    return playerSetName;
  }

  moveConnection(player) {
    this.connections = this.connections.filter(p => p.id !== player.id);

    // if this player was a disconnected player
    const disconnectedPlayer = this.findDisconectByName(player.name);
    if (!!disconnectedPlayer) {
      // remove them from the disconnected player list
      this.disconnects.filter(p => p.id !== disconnectedPlayer.id);
      // set them to be a spy if they were a spy
      player.setIsSpy(disconnectedPlayer.getIsSpy());
    }

    // add them to the players list
    this.players.push(player);
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

  // ROUND LOGIC

  clearDisconnects() {
    // at the end of a round we will clear the disconnects
    this.disconnects = [];
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

  findDisconectByName(playerName) {
    return this.disconnects.find(p => p.name === playerName);
  }

  findConnection(socket) {
    return this.connections.find(p => p.id === socket.id);
  }

  findPlayer(socket) {
    return this.players.find(p => p.id === socket.id);
  }

  count() {
    // count is the size of the player and potential connections
    return this.players.length + this.connections.length;
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