'use strict';

// TODO: make a debug option so you can test on multiple computers
// https://stackoverflow.com/questions/30712141/connect-to-localhost3000-from-another-computer-expressjs-nodejs
// https://github.com/riebel/socketio-es6-starter

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { ServerSocket } from './serverSocket.js';
import { router } from './routes/index.js';

// config
dotenv.config();
const { PORT, CLIENT_ENDPOINT } = process.env;
const corsOptions = {
  origin: CLIENT_ENDPOINT,
  optionsSuccessStatus: 200
}

// app
const app = express();
app.set('view engine', 'ejs');
app.use(cors(corsOptions));
app.use(router);
app.use('/assets', express.static('assets'));
// app.use('/assets', express.static(path.resolve('../assets')));

// server
const server = http.Server(app);
server.listen(PORT, () => {
  console.log(`[INFO] Listening for ${CLIENT_ENDPOINT} on *:${PORT}`);
});

// socket
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ENDPOINT,
    methods: ["GET", "POST"],
    allowedHeaders: [],
    credentials: true
  }
});
const serverSocket = new ServerSocket(io);

export { serverSocket };
