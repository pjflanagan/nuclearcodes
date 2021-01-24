'use strict';

// https://github.com/riebel/socketio-es6-starter

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// import path from 'path';
// import bodyParser from 'body-parser';
// import compression from 'compression';

import { ServerSocket } from './serverSocket.js';
import { router } from './routes/index.js';

const app = express();
app.use(router);
const server = http.Server(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: [],
    credentials: true
  }
});;

const serverSocket = new ServerSocket(io);


// TODO: make a debug option so you can test on multiple computers
// https://stackoverflow.com/questions/30712141/connect-to-localhost3000-from-another-computer-expressjs-nodejs
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});

export { serverSocket };
