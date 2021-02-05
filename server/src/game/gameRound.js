import { MIN_PLAYERS_PER_GAME } from './gameHelpers.js';


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
}

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
  }
}

const RoundEnterCodeHandlers = {
  isPollOver: (players) => {
    const codeResponses = players.getResponses();
    if (codeResponses.length < players.count()) {
      return [false];
    }
    return [true, { codeResponses }];
  }
}


export {
  RoundLobbyHandlers,
  RoundChooseRoomHandlers,
  RoundEnterCodeHandlers
}