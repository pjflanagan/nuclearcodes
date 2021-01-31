import { PLAYERS_PER_GAME } from './gameHelpers.js';

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
  pollResponse: (player, players, response) => {
    // kick third player out of room if are also on the room
    // based off of response time, latest response gets kicked
    // TODO: validate here, they can't enter same room as last time
    const sameRoomPlayers = players.sameRoomPlayers(response.data.roomID)
    if (sameRoomPlayers.length > 1) {
      sameRoomPlayers.sort((a, b) => b.response.timestamp - a.response.timestamp);
      // TODO: validate here, they can't enter room with same parter as before

      sameRoomPlayers[0].unsetResponse()
    }
    player.recordResponse(response.data);
  },
  isPollOver: (players) => {
    // validate that everyone is paired off in a room
    // TODO: everyone is in a pair they have not been in last round
    // TODO: everyone is in a room they haven't been in last round
    const rooms = players.createRoomArray();
    // console.debug(rooms);
    let hasInvalidRoom = false;
    let roomVoteResponseCount = 0;
    rooms.forEach((playersInRoom) => {
      const count = playersInRoom.length;
      roomVoteResponseCount += count;
      // TODO: if a player drops the game breaks because of this rule
      if (count % 2 !== 0 || count > 2) {
        // if not an even number (pair) or 0
        hasInvalidRoom = true;
      }
    });
    return [
      !hasInvalidRoom && roomVoteResponseCount >= players.count(),
      { rooms }
    ];
  }
}

const RoundTurnKeyHandlers = {
  // validate that they are a spy
  pollResponse: (player, response) => {
    if (player.getIsSpy()) {
      player.recordResponse(response.data);
    } else {
      console.error(`gameRoom.pollResponse: Response '${response.type}' recieved for agent, not spy.`);
    }
  },
  isPollOver: (players) => {
    const spies = players.getSpies();
    const spyResponses = spies.map(spy => ({
      response: spy.response,
      playerID: spy.id
    }));
    // console.debug(spyResponses);
    if (spyResponses.filter(r => r.response !== false).length < spies.length) {
      // if the spies have not all responded
      // TODO: auto response here to keep game moving? maybe shouldn't happen here in code but we should have it in general
      return [false];
    }
    return [true, { spyResponses }];
  }
};

const RoundEnterCodeHandlers = {
  isPollOver: (players) => {
    const codeResponses = players.getResponses();
    if (codeResponses.length < players.count()) {
      return [false];
    }
    return [true, codeResponses];
  }
}


export {
  RoundLobbyHandlers,
  RoundTurnKeyHandlers,
  RoundVoteHandlers,
  RoundEnterCodeHandlers
}