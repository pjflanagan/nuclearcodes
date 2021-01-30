
import io from "socket.io-client";

import {
  nextSlide,
  updateGameState,
} from '../actions';
import { getNextPlay } from "../gameplay";

const { REACT_APP_SOCKET_ENDPOINT } = process.env;


const socket = io(REACT_APP_SOCKET_ENDPOINT, {
  withCredentials: true,
});

class SocketServiceClass {

  // recievers

  startService() {
    return (dispatch) => {
      socket.on('NEXT_SLIDE', (data) => {
        const slide = getNextPlay(data.slideID, data.data)
        dispatch(nextSlide(slide));
      });
      socket.on('GAME_STATE', data => {
        dispatch(updateGameState(data));
      });
    }
  }

  // senders

  joinRoom(data) {
    socket.emit('JOIN_ROOM', data);
  }

  setPlayerName(data) {
    socket.emit('SET_PLAYER_NAME', data);
  }

  pollResponse(data) {
    socket.emit('POLL_RESPONSE', data);
  }

  // helpers

  getID() {
    return socket.id;
  }
}

const SocketService = new SocketServiceClass();

export { SocketService };
