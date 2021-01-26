'use strict';

// https://github.com/riebel/socketio-es6-starter

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

// import path from 'path';
// import bodyParser from 'body-parser';
// import compression from 'compression';

import { ServerSocket } from './serverSocket.js';
import { router } from './routes/index.js';

dotenv.config();
const { PORT, CLIENT_ENDPOINT } = process.env;
const corsOptions = {
  origin: CLIENT_ENDPOINT,
  optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions));
app.use(router);
const server = http.Server(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ENDPOINT,
    methods: ["GET", "POST"],
    allowedHeaders: [],
    credentials: true
  }
});

const serverSocket = new ServerSocket(io);


// TODO: make a debug option so you can test on multiple computers
// https://stackoverflow.com/questions/30712141/connect-to-localhost3000-from-another-computer-expressjs-nodejs
server.listen(PORT, () => {
  console.log(`[INFO] Listening for ${CLIENT_ENDPOINT} on *:${PORT}`);
});

export { serverSocket };
