
import express from 'express';

import { serverSocket } from '../index.js';

const router = express.Router();

// TODO: check alive route with no data?

const { SERVER_ENDPOINT, CLIENT_ENDPOINT, ENV } = process.env;

router.get("/", (req, res) => {
  res.send({
    status: "alive",
    players: serverSocket.roomAssignments.length,
    games: serverSocket.gameRooms.length
  }).status(200);
});

router.get("/test", (req, res) => {
  res.render('test', {
    CLIENT_ENDPOINT,
    SERVER_ENDPOINT,
    ENV
  });
});

export { router }