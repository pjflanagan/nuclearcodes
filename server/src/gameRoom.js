

// TODO: gameplay could be on the server?

// The rooms host is just user[0]

class GameRoom {
  constructor(roomName) {
    this.name = roomName;
    this.players = [];
    // 
  }

  joinRoom(socket) {
    this.players.push({
      id: socket.id
    });
  }

  disconnect(socket) {
    this.players = this.players.filter(u => u.id === socket.id);
  }

  setPlayerName(socket, playerName) {
    const player = this.players.find(p => p.id === socket.id);
    player.name = playerName;
  }

  getState() {
    const gameState = {
      players: this.players
    };
    return gameState;
  }

  isEmpty() {
    return this.players.length === 0;
  }
}

export { GameRoom };