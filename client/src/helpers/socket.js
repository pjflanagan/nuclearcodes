
import io from "socket.io-client";


const ENDPOINT = '//localhost:5000';

class Socket {
  constructor() {
    this.socket = io(ENDPOINT, {
      withCredentials: true,
    });
    this.user = {};
  }

  signIn() {

  }
};

// TODO: export socket
// const socket = new Socket();

export { Socket };
