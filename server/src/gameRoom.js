


// The rooms host is just user[0]
// not sure what the host will do anymore

const GAME_STATES = [
  'LOBBY',
  'INTRODUCTION', // here we will set spies and game code, introduce the rules, this should trigger a slide change
  'ROUND_VOTE', // vote on which room to go into
  'ROUND_TURN_KEY', // vote on which key to turn
  'ROUND_ENTER_CODE', // enter a code into the game
  'GAME_OVER' // ask if they'd like to play again
];

class GameRoom {
  constructor(roomName) {
    this.name = roomName;

    // game state
    this.players = [];
    this.gameState = GAME_STATES[0];
    this.round = 0;

    // server side
    this.code = '';
    this.fakeCode = '';
    this.pollResponse = [];
  }

  joinRoom(socket) {
    this.players.push({
      id: socket.id
    });
  }

  disconnect(socket) {
    this.players = this.players.filter(u => u.id !== socket.id);
  }

  setPlayerName(socket, playerName) {
    const player = this.players.find(p => p.id === socket.id);
    player.name = playerName;
  }

  getState() {
    const gameState = {
      players: this.players,
      gameState: this.gameState,
      round: this.round
    };
    return gameState;
  }

  isEmpty() {
    return this.players.length === 0;
  }
}

export { GameRoom };