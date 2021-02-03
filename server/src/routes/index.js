
import express from 'express';
import dotenv from 'dotenv';

import { serverSocket } from '../index.js';

const router = express.Router();

dotenv.config();
const { CLIENT_ENDPOINT, ENV } = process.env;

// check if the server is alive and return some data too
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

router.get("/autoTest", (req, res) => {
  res.render('autoTest', {
    CLIENT_ENDPOINT,
    ENV
  });
});

export { router }