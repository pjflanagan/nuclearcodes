
import io from "socket.io-client";

import {
  nextSlide,
  updateGameState,
  setErrors
} from '../actions';
import { getNextSlide } from "../gameplay";

const { REACT_APP_SOCKET_ENDPOINT } = process.env;
const socket = io(REACT_APP_SOCKET_ENDPOINT, {
  withCredentials: true,
});

class SocketServiceClass {

  // recievers

  startService() {
    return (dispatch) => {
      socket.on('NEXT_SLIDE', ({ slideID, data }) => {
        const slide = getNextSlide(slideID, data);
        dispatch(nextSlide(slide));
      });
      socket.on('GAME_STATE', data => {
        dispatch(updateGameState(data));
      });
      socket.on('SET_ERRORS', data => {
        dispatch(setErrors(data.errors));
      })
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
