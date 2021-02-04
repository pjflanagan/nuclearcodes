import { PLAYERS_PER_GAME } from './gameHelpers.js';

const getPlayerPreviousRoom = (prevRooms, player) => {
  let prevRoomID = -1;
  let prevRoomMate = false;
  // if there are previous rooms
  if (prevRooms.length > 0) {
    // go through each and find the one
    prevRooms.forEach((room, i) => {
      const playerWasInRoomBefore = room.find(p => p.id === player.id);
      if (!!playerWasInRoomBefore) {
        prevRoomID = i;
        prevRoomMate = room.find(p => p.id !== player.id);
        return;
      }
    });
  }
  return [prevRoomID, prevRoomMate];
}

const RoundLobbyHandlers = {
  // if they are readying up in the lobby
  // validate they have enough players and they are all ready
  isPollOver: (players) => {
    const playerCount = players.count();
    if (playerCount < PLAYERS_PER_GAME) {
      return [false];
    }
    const lobbyResponses = players.getResponses();
    if (lobbyResponses.length < playerCount) {
      return [false];
    }
    return [true];
  },
}

const RoundVoteHandlers = {
  pollResponse: (player, players, response, prevRooms) => {
    // validate here they can't enter same room as last time
    const [prevRoomID, prevRoomMate] = getPlayerPreviousRoom(prevRooms, player);
    if (prevRoomID === response.data.roomID) {
      return [`Cannot join same room as last round.`];
    }
    const sameRoomPlayers = players.sameRoomPlayers(response.data.roomID);
    if (sameRoomPlayers.length > 0) {
      // if there is already a player in here, order them by the time they entered
      sameRoomPlayers.sort((a, b) => a.response.timestamp - b.response.timestamp);

      // validate here they can't enter room with same parter as before
      if (sameRoomPlayers[0].id === prevRoomMate.id) {
        return [`Cannot join room with the same partner as last time.`];
      }

      if (sameRoomPlayers.length > 1) {
        // if there are two in here, kick the second player out
        sameRoomPlayers[1].unsetResponse();
      }
    }
    player.recordResponse(response.data);
    return [];
  },
  isPollOver: (players) => {
    // validate that everyone is paired off in a room, no validation
    // about partners or which room, validation was done in poll response
    const rooms = players.createRoomArray();
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
  RoundVoteHandlers,
  RoundEnterCodeHandlers
}