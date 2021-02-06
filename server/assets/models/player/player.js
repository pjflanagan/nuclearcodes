

class PlayerModel {
  constructor($scope, room, playerName) {
    this.$scope = $scope;
    this.room = room;
    this.playerName = playerName;
    this.response = {};
    this.socket = io('/', {
      withCredentials: true,
    });

    this.lastSlideID = '';
    this.lastRoomID = -1;
    this.lastSawLetter = '';

    this.slide = '';
    this.gameState = {
      players: [],
      round: 0
    };
    this.errors = [];

    // this.isConnected = true;

    // login
    this.login();
    this.makeListeners();
  }

  makeListeners() {
    this.socket.on('NEXT_SLIDE', (data) => {
      this.slide = data;
      this.$scope.$apply();
    });
    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
      this.$scope.$apply();
    });
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
      type: 'ROUND_CHOOSE_ROOM',
      data: {
        roomID,
        timestamp: Date.now()
      }
    });
  }

  sendEnterCode(isCorrect) {
    // spies send an incorrect code
    // agents send what the user enters
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_ENTER_CODE',
      data: {
        code: (this.isSpy() || !isCorrect) ? 'RANDO' : this.gameState.code
      }
    });
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
}

export { PlayerModel };