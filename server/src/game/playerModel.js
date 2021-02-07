

// a player object that represents a player
class Player {
  constructor({ id }) {
    this.id = id;
    this.isSpy = false;
    this.response = false;
    this.name = '';
  }

  setName(name) {
    this.name = name;
  }

  setIsSpy(isSpy) {
    this.isSpy = isSpy;
  }

  getIsSpy() {
    return this.isSpy;
  }

  // TODO: better response handling (getting)

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

// contains functions to help with the management of multiple players
class PlayerList {
  constructor() {
    this.players = [];
  }

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

  findPlayer(socket) {
    return this.players.find(p => p.id === socket.id);
  }

  get(i) {
    if (i >= this.players.length) {
      return false;
    }
    return this.players[i];
  }

  getSpies() {
    return this.players.filter(p => p.getIsSpy());
  }

  createRoomArray(roomCount) {
    const rooms = Array(roomCount).fill(new Array());
    this.players.forEach(player => {
      if (
        player.response !== false &&
        player.response.roomID !== undefined &&
        player.response.roomID < rooms.length
      ) {
        rooms[player.response.roomID] = [...rooms[player.response.roomID], player];
      }
    });
    return rooms;
  }

  getPlayersAsData() {
    return this.players.map(p => p.asData());
  }

  getResponses() {
    return this.players.map(p => p.response).filter(r => r !== false);
  }

  getAgentResponses() {
    return this.players.filter(p => !p.isSpy).map(p => p.response).filter(r => r !== false);
  }

  clearResponses() {
    this.players.forEach(p => p.response = false);
  }

  sameRoomPlayers(roomID) {
    return this.players.filter(p => p.response !== false && p.response.roomID === roomID);
  }

  count() {
    return this.players.length;
  }

  resetSpies() {
    this.players.forEach(p => p.setIsSpy(false));
  }
}

export { Player, PlayerList }