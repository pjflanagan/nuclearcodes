// import { GameRoom } from './gameRoom.js';

// https://socket.io/docs/emit-cheatsheet/

class ServerSocket {
  constructor(io) {
    this.io = io;
    this.games = [];
    this.roomAssignments = [];

    this.setup = this.setup.bind(this);
    this.setup();
  }

  setup() {
    this.io.on('connection', (socket) => {
      this.connection(socket);
      socket.on('JOIN_ROOM', (data) => this.joinRoom(socket, data));
      socket.on('SHARE_NAME', (data) => this.shareName(socket, data));
      socket.on('disconnect', () => this.disconnect(socket));
    });
  }

  // ADMIN

  connection(socket) {
    console.log('connection:', socket.id);
  }

  // sendConnection(socket, data) {
  //   const buffer = fp.encode(EVENTS.addSelf, data);
  //   // TODO: send the connection to just the room they are trying to join
  //   socket.broadcast.emit(EVENTS.addNewUser, buffer);
  //   this.io.to(`${data.userID}`).emit(EVENTS.addSelf, buffer);
  // }

  disconnect(socket) {
    console.log('disconnect:', socket.id);
    this.roomAssignments.filter(ra => socket.id === ra.socketID);
    // TODO: handle picking a new host if necessary
  }

  // ROOMS

  joinRoom(socket, data) {
    console.log(data);
    const { roomName } = data;
    socket.join(roomName);
    this.roomAssignments.push({
      socketID: socket.id,
      roomName
    });
    // if the room exists sendConnection
    this.io.to(roomName).emit('ADD_NEW_USER', socket.id);
  }

  shareName(socket, { playerName }) {
    const roomName = this.getRoomAssignment(socket);
    this.io.to(roomName).emit('SHARE_NAME', {
      socketID: socket.id,
      playerName
    });
  }


  // Helpers

  getRoomAssignment(socket) {
    return this.roomAssignments.find(ra => socket.id === ra.socketID).roomName;
  }


}

export { ServerSocket }