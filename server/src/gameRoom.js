

// TODO: gameplay could be on the server?

// The rooms host is just user[0]

class GameRoom {
  constructor(roomName) {
    this.name = roomName;
    this.users = [];
    // 
  }

  joinRoom(socket) {
    this.users.push(socket.id) = {
      id: socket.id
    };
  }

  disconnect(socket) {
    this.users = this.users.filter(u => u.id === socket.id);
  }

  updateUserName(socket, playerName) {
    const user = this.users.find(u => u.id === socket.id);
    user.name = playerName;
  }

  getState() {
    return {
      users: this.users
    };
  }

  isEmpty() {
    return this.users.length === 0;
  }
}

export { GameRoom };