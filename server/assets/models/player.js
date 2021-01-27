
import { updateDisplay } from '../script.js';

class PlayerModel {
  constructor(roomName, playerName) {
    this.roomName = roomName;
    this.playerName = playerName;
    this.socket = io(SOCKET_ENDPOINT, {
      withCredentials: true,
    });
    // TODO: init a new socket
    // sign in to a room
    // sign in with your name
    this.login();


    // listeners
    this.socket.on('ADD_PLAYER', (data) => {
      // dispatch(addPlayer(data));
    });
    this.socket.on('NEXT_SLIDE', (data) => {
      this.slide = data;
    });
    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
    });
  }

  login() {
    this.socket.emit('JOIN_ROOM', {
      roomName: this.roomName
    });
    this.socket.emit('SET_PLAYER_NAME', {
      playerName: this.playerName
    });
  }

  disconnect() {
    delete this.socket;
  }
}

export { PlayerModel };