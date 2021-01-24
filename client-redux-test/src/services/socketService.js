
import io from "socket.io-client";

const ENDPOINT = '//localhost:5000';
const socket = io(ENDPOINT, {
  withCredentials: true,
});

class SocketService {
  startService() {
    return (dispatch) => {
      socket.on('addPlayer', (data) => {
        dispatch(addPlayer(data));
      });
      socket.on('changeSlide', (data) => {
        dispatch(changeSlide(data));
      });
    }
  }
}

export { SocketService, socket };
