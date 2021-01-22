'use strict';

// https://github.com/riebel/socketio-es6-starter

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

// import path from 'path';
// import bodyParser from 'body-parser';
// import compression from 'compression';

import { ServerSocket } from './s_socket.js'
import RouteIndex from './routes';

const app = express();
app.use(RouteIndex);
const server = http.Server(app);
const io = SocketIO(server);
const port = process.env.PORT || 6415;

new ServerSocket(io);


// TODO: make a debug option so you can test on multiple computers
// https://stackoverflow.com/questions/30712141/connect-to-localhost3000-from-another-computer-expressjs-nodejs
server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});
