

class PlayerModel {
  constructor($scope, room, playerName) {
    this.$scope = $scope;
    this.room = room;
    this.playerName = playerName;
    this.response = {};
    this.socket = io('/', {
      withCredentials: true,
    });

    this.slide = '';
    this.gameState = {
      players: []
    };
    // this.isConnected = true;

    // listeners
    this.socket.on('NEXT_SLIDE', (data) => {
      this.slide = data;
      this.$scope.$apply();
    });
    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
      this.$scope.$apply();
    });

    // login
    this.login();
  }

  // socket

  login() {
    this.socket.emit('JOIN_ROOM', {
      roomName: this.room.roomName
    });
    this.socket.emit('SET_PLAYER_NAME', {
      playerName: this.playerName
    });
  }

  disconnectPlayer() {
    this.socket.disconnect();
    this.isConnected = false;
  }

  sendReadyUp() {
    this.socket.emit('POLL_RESPONSE', {
      type: 'LOBBY',
      data: true
    });
  }

  sendRoomChoice() {
    const { roomID } = this.response;
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_VOTE',
      data: {
        roomID,
        timestamp: Date.now() // TODO: should this happen on backend, eh
      }
    });
  }

  sendKeyChoice() {
    const { isSpyKey } = this.response;
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_TURN_KEY',
      data: isSpyKey
    });
  }

  sendEnterCode() {
    const { code } = this.response;
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_ENTER_CODE',
      data: { code }
    });
  }


  // helpers 

  isSpy() {
    const socketID = this.socket.id;
    const playerInfo = this.gameState.players.find(p => p.id === socketID);
    if (!playerInfo) {
      return false;
    }
    return !!playerInfo.isSpy;
  }
}

export { PlayerModel };