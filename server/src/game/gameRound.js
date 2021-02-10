import {
  MIN_PLAYERS_PER_GAME,
  stringDiff,
  mostCommonCode
} from './gameHelpers.js';

const RoundLobbyHandlers = {
  // if they are readying up in the lobby
  // validate they have enough players and they are all ready
  isPollOver: (players) => {
    const playerCount = players.count();
    if (playerCount < MIN_PLAYERS_PER_GAME) {
      // this should not happen, they are not allowed to respond
      // if the room doesn't have at least MIN_PLAYERS_PER_GAME
      return [false];
    }
    const lobbyResponses = players.getResponses();
    if (lobbyResponses.length < playerCount) {
      return [false];
    }
    return [true];
  },
};

const RoundChooseRoomHandlers = {
  isPollOver: (roomCount, players) => {
    // validate that everyone is paired off in a room, no validation
    // about partners or which room, validation was done in poll response
    const rooms = players.createRoomArray(roomCount);
    const roomVoteResponseCount = rooms.reduce((sum, playersInRoom) => sum + playersInRoom.length, 0);
    return [
      roomVoteResponseCount >= players.count(),
      { rooms }
    ];
  },
  moveGameState: ({ rooms, code, fakeCode, socketServer }) => {
    // for each room
    rooms.forEach((room, i) => {
      // if it has no people in it, return
      if (room.length === 0) {
        return;
      }
      // send a message to each socket, that says who they are in the room with
      // send this prompt to everyone, even non spies, show different message for spies
      room.forEach(player => {
        // for each player in the room reveal the letter they are supposed to see
        socketServer.nextSlide(player.id, {
          slideID: 'letter-reveal',
          data: {
            roomID: i,
            realLetter: code[i],
            fakeLetter: fakeCode[i]
          }
        })
      });
    });
  }
};

const RoundEnterCodeHandlers = {
  isPollOver: (players) => {
    const allResponses = players.getResponses();
    if (allResponses.length < players.count()) {
      return [false];
    }
    const codeResponses = players.getAgentResponses();
    return [true, { codeResponses }];
  },
  moveGameState: ({ codeResponses, code }) => {
    const { code: guessedCode } = mostCommonCode(codeResponses);
    // TODO: if the code is not the right length (which it shouldn't be), then there should be an error
    const codeDiff = stringDiff(code, guessedCode);
    const charsCorrect = code.length - codeDiff.length;

    return {
      guessedCode,
      charsCorrect
    }
  }
};

export {
  RoundLobbyHandlers,
  RoundChooseRoomHandlers,
  RoundEnterCodeHandlers,
}