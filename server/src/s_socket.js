// import { Game } from './s_game.js';


// https://socket.io/docs/emit-cheatsheet/

class ServerSocket {
  constructor(io) {
    this.io = io;
    this.games = [];

    this.setup = this.setup.bind(this);
  }

  setup() {
    this.io.on('connection', (socket) => {
      this.recvConnection(socket);
      socket.on('disconnect', () => this.recvDisconnect(socket));
    });
  }

  // ADMIN

  recvConnection(socket) {
    console.log('connection:', socket.id, socket.handshake.query.name);
  }

  sendConnection(socket, data) {
    // const buffer = fp.encode(EVENTS.addSelf, data);
    // TODO: send the connection to just the room they are trying to join
    // socket.broadcast.emit(EVENTS.addNewUser, buffer);
    // this.io.to(`${data.userID}`).emit(EVENTS.addSelf, buffer);
  }

  recvDisconnect(socket) {
    console.log('disconnect:', socket.id);
    // TODO: handle picking a new host if necessary
  }


}

export { ServerSocket }