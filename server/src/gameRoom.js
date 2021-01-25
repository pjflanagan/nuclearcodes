


// The rooms host is just user[0]
// not sure what the host will do anymore

const GAME_STATES = {
  LOBBY: 0,
  INTRODUCTION: 1, // here we will set spies and game code, introduce the rules, ask to confirm at the end before starting vote round "Does everyone know what they are?"
  ROUND_VOTE: 2, // vote on which room to go into
  ROUND_TURN_KEY: 3, // vote on which key to turn
  ROUND_ENTER_CODE: 4, // enter a code into the game
  GAME_OVER: 5 // ask if they'd like to play again
};

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
    const player = this.findPlayer(socket);
    player.name = playerName;
  }

  pollResponse(socket, response) {
    const player = this.findPlayer(socket);

    switch (response.type) {
      case 'ready-up':
        player.response = response.data;

    }

    // TODO: somethere here with logging the response
    // and validating it
    // TODO: how will we do room picking, is it a free for all
    // or should one agent get voted on and then they do it?

    if (this.isPollOver()) {
      this.moveGameState();
    }
  }

  moveGameState() {
    this.clearResponses();
    switch (this.gameState) {
      case GAME_STATES.LOBBY:
        this.gameState = GAME_STATES.INTRODUCTION;
        this.socketServer.nextSlide(this.name, {
          slideID: 'introduction'
        });
        break;
      case GAME_STATES.INTRODUCTION:
        this.gameState = GAME_STATES.ROUND_VOTE;
        this.socketServer.nextSlide(this.name, {
          slideID: 'defcon', // show the defcon before each round for fun
          data: {
            round: this.round
          }
        });
        break;
      case GAME_STATES.ROUND_ENTER_CODE:
        // TODO: this will change based on which round it is, might be GAME_OVER
        // might be vote to KILL?
        break;
      default:
        break;
    }
  }

  getState() {
    const gameState = {
      players: this.players,
      responses: this.responses
    };
    return gameState;
  }

  isPollOver() {
    // TODO: change this
    // return this.responses.length >= this.players.length;
  }

  findPlayer(socket) {
    return this.players.find(p => p.id === socket.id)
  }

  isFull() {
    return this.players.length >= 6;
  }

  isEmpty() {
    return this.players.length === 0;
  }
}

export { GameRoom };