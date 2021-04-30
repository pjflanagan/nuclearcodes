

class PlayerModel {
  constructor($scope, room, playerName) {
    this.$scope = $scope;
    this.room = room;
    this.playerName = playerName;
    this.response = {
      hasResponded: false
    };
    this.socket = io('/', {
      withCredentials: true,
    });

    this.slide = '';
    this.gameState = {};
    this.errors = [];

    // login
    this.login();
    this.makeDefaultListeners();
    this.makeListeners();
  }

  makeDefaultListeners() {
    this.socket.on('NEXT_SLIDE', (data) => {
      this.slide = data;
      this.response.hasResponded = false;
      this.$scope.$apply();
    });
    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
      this.$scope.$apply();
    });
    this.socket.on('SET_ERRORS', data => {
      this.errors = data.errors;
      this.$scope.$apply();
    });
  }

  makeListeners() {
  }

  // socket

  login() {
    this.socket.emit('JOIN_ROOM', {
      roomName: this.room.roomName
    });
    this.submitName();
  }

  submitName() {
    this.socket.emit('SET_PLAYER_NAME', {
      playerName: this.playerName
    });
  }

  disconnectPlayer() {
    this.socket.disconnect();
    // this.gameState = {};
    // this.$scope.$apply();
  }

  // TODO: TODO:
  reconnectPlayer() {
    this.login();
  }

  sendReadyUp() {
    this.socket.emit('POLL_RESPONSE', {
      type: 'LOBBY',
      data: true
    });
    this.response.hasResponded = true;
  }

  sendRoomChoice() {
    const { roomID } = this.response;
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_CHOOSE_ROOM',
      data: {
        roomID
      }
    });
    this.response.hasResponded = true;
  }

  sendRandomRoom() {
    this.response.roomID = Math.floor(Math.random() * this.gameState.codeLength);
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_CHOOSE_ROOM',
      data: {
        roomID: this.response.roomID
      }
    });
    this.response.hasResponded = true;
  }

  sendEnterCode(isCorrect) {
    // spies send an incorrect code
    // agents send what the user enters
    this.response.code = (this.isSpy() || !isCorrect) ? this.gameState.fakeCode : this.gameState.code;
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_ENTER_CODE',
      data: {
        code: this.response.code
      }
    });
    this.response.hasResponded = true;
  }

  sendManualCode(code = '') {
    this.response.code = code !== '' ? code : this.response.code;
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_ENTER_CODE',
      data: {
        code: this.response.code
      }
    });
    this.response.hasResponded = true;
  }


  // helpers

  getPlayerInfoFromGameState() {
    const socketID = this.socket.id;
    const playerInfo = this.gameState.players.find(p => p.id === socketID);
    return playerInfo;
  }

  isSpy() {
    const playerInfo = this.getPlayerInfoFromGameState()
    if (!playerInfo) {
      return false;
    }
    return !!playerInfo.isSpy;
  }

  isConnected() {
    return this.socket.connected;
  }

  getClass() {
    if (!this.isConnected()) {
      return 'disconnected';
    } else if (this.isSpy()) {
      return 'spy';
    }
    return '';
  }
}

export { PlayerModel };