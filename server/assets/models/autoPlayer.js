
class AutoPlayerModel {
  constructor($scope, room, playerName, i) {
    this.$scope = $scope;
    this.room = room;
    this.playerName = playerName;
    this.index = i;
    this.socket = io('/', {
      withCredentials: true,
    });

    this.lastSlideID = '';
    this.lastRoomID = -1;
    this.lastSawLetter = '';
    this.errors = [];
    this.gameState = {
      players: [],
      round: 0
    };

    this.socket.on('NEXT_SLIDE', (data) => {
      this.lastSlideID = data.slideID;
      switch (data.slideID) {
        case 'name-prompt':
          // submit name
          this.submitName();
          break;
        case 'welcome-agent':
          // ready up
          this.sendReadyUp();
          break;
        case 'introduction':
          // choose room
          this.sendRoomChoice();
          break;
        // case 'key-room-prompt':
        //   if (this.isSpy()) {
        //     // choose key to turn
        //     this.sendKeyChoice();
        //   }
        //   break;
        case 'letter-reveal':
          // display revealed letter
          this.recvLetterReveal(data);
          break;
        case 'start-next-round':
          // choose room
          this.sendRoomChoice();
          break;
        case 'gameover':
          // ready up
          this.sendReadyUp();
          break;
        default:
          console.error('unaccounted for state');
      }
      this.$scope.$apply();
    });

    this.socket.on('GAME_STATE', data => {
      this.gameState = data;
      // const playerInfo = this.getPlayerInfoFromGameState();
      // if (playerInfo.response === false) {
      //   // if the player is not in a room any more re-enter that room by sending again
      //   if (this.lastSlideID === 'introduction' || this.lastSlideID === 'start-next-round') {
      //     this.sendRoomChoice();
      //   }
      // }
      this.$scope.$apply();
    });

    this.socket.on('SET_ERRORS', data => {
      this.errors = data.errors;
      // if (data.type === 'GameRoom.pollResponse.ROUND_VOTE') {
      //   // if we have an error entering the room, try and enter again
      //   this.sendRoomChoice();
      // }
      this.$scope.$apply();
    });

    this.login();
  }

  login() {
    this.socket.emit('JOIN_ROOM', {
      roomName: this.room.roomName
    });
  }

  submitName() {
    this.socket.emit('SET_PLAYER_NAME', {
      playerName: this.playerName
    });
  }

  sendReadyUp() {
    this.socket.emit('POLL_RESPONSE', {
      type: 'LOBBY',
      data: true
    });
  }

  sendRoomChoice() {
    this.lastRoomID = this.room.getRoomIDThisRound(this.gameState.round, this.index);
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_VOTE',
      data: {
        roomID: this.lastRoomID,
        timestamp: Date.now()
      }
    });
  }

  sendKeyChoice() {
    this.socket.emit('POLL_RESPONSE', {
      type: 'ROUND_TURN_KEY',
      data: {
        isSpyKey: Math.random() > 0.5
      }
    });
  }

  recvLetterReveal(data) {
    switch (data.showWhichLetter) {
      case 'FAKE':
        this.lastSawLetter = `${data.showWhichLetter}: ${data.fakeLetter}`;
        break;
      case 'REAL':
        this.lastSawLetter = `${data.showWhichLetter}: ${data.realLetter}`;
        break;
      case 'BOTH':
        this.lastSawLetter = `${data.showWhichLetter}: ${data.realLetter} && ${data.fakeLetter}`;
        break;
    }
    this.$scope.$apply();
  }

  sendEnterCode(isCorrect) {
    console.log({ isCorrect, gameState: this.gameState })
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

export { AutoPlayerModel }