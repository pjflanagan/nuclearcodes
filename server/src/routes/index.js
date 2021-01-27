
import express from 'express';
import dotenv from 'dotenv';

import { serverSocket } from '../index.js';

const router = express.Router();

// TODO: check alive route with no data?

dotenv.config();
const { CLIENT_ENDPOINT, ENV } = process.env;

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
    ENV
  });
});

export { router }