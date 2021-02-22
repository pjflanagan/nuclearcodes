
import { PlayerList, Player } from '../../src/game/playerModel.js'

function mPlayerID(index) {
  return `p${index}`
}

function mSocket(index) {
  return { id: mPlayerID(index) };
}

function makePlayerList(count) {
  const playerList = new PlayerList();
  for (let i = 0; i < count; ++i) {
    playerList.addPlayer(new Player(mSocket(i)));
    playerList.setPlayerName(mSocket(i), mPlayerID(i))
  }
  return playerList;
};

export { makePlayerList, mSocket, mPlayerID }