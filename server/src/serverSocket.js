// import { GameRoom } from './gameRoom.js';

import { GameRoom } from "./gameRoom.js";

// https://socket.io/docs/emit-cheatsheet/

class ServerSocket {
  constructor(io) {
    this.io = io;
    this.gameRooms = [];
    this.roomAssignments = [];

    this.setup = this.setup.bind(this);
    this.setup();
  }

  setup() {
    this.io.on('connection', (socket) => {
      this.connection(socket);
      socket.on('JOIN_ROOM', (data) => this.joinRoom(socket, data));
      socket.on('SET_PLAYER_NAME', (data) => this.shareName(socket, data));
      socket.on('disconnect', () => this.disconnect(socket));
    });
  }

  // ADMIN

  connection(socket) {
    console.log('[INFO] New connection:', socket.id);
  }

  disconnect(socket) {
    console.log('[INFO] disconnect:', socket.id);

    const gameRoom = this.getUserRoom(socket);

    if (!!gameRoom) {
      // if there is a room, disconnect them from it
      this.roomAssignments = this.roomAssignments.filter(ra => socket.id !== ra.socketID);
      gameRoom.disconnect(socket);

      if (gameRoom.isEmpty()) {
        // if the room is empty, delete the room
        this.gameRooms = this.gameRooms.filter(gr => gr.name !== gameRoom.name);
      } else {
        // otherwise alert the room
        this.io.to(gameRoom.name).emit('GAME_STATE', gameRoom.getState());
      }
    } else {

    }
    // if they aren't in a room then do nothing
  }

  // ROOMS

  joinRoom(socket, data) {
    const { roomName } = data;

    // join the room on socket
    socket.join(roomName);

    // assign this player to this room
    this.roomAssignments.push({
      socketID: socket.id,
      roomName
    });

    const gameRoom = this.getRoomByName(roomName);
    if (!gameRoom) {
      // if this room does not exist then create it
      // and send a new room state to the user
      const newGameRoom = new GameRoom(roomName)
      this.gameRooms.push(newGameRoom);
      newGameRoom.joinRoom(socket);
      this.io.to(socket.id).emit('GAME_STATE', newGameRoom.getState());
    } else {
      // otherwise send the room info to the user
      // and send the new user to the other players
      gameRoom.joinRoom(socket);
      this.io.to(roomName).emit('ADD_NEW_USER', socket.id);
      this.io.to(socket.id).emit('GAME_STATE', gameRoom.getState());
    }
  }

  shareName(socket, { playerName }) {
    const gameRoom = this.getUserRoom(socket);
    gameRoom.setPlayerName(socket, playerName);
    this.io.to(gameRoom.name).emit('GAME_STATE', gameRoom.getState());
  }


  // Helpers

  getRoomAssignment(socket) {
    const roomAssignment = this.roomAssignments.find(ra => socket.id === ra.socketID);
    if (!!roomAssignment) {
      return roomAssignment.roomName;
    }
    return false;
  }

  getRoomByName(roomName) {
    return this.gameRooms.find(gameRoom => gameRoom.name === roomName);
  }

  getUserRoom(socket) {
    const gameRoomName = this.getRoomAssignment(socket);
    if (!!gameRoomName) {
      return this.getRoomByName(gameRoomName);
    }
    return false;
  }



}

export { ServerSocket }