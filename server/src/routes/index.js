
import express from 'express';
import dotenv from 'dotenv';

import { serverSocket } from '../index.js';

const router = express.Router();

dotenv.config();
const { CLIENT_ENDPOINT, ENV } = process.env;

// checks if server is alive
router.get("/", (req, res) => {
  res.send({
    status: "alive"
  }).status(200);
});

// return the game rules
router.get("/rules", (req, res) => {
  res.send({
    MIN_PLAYERS_PER_GAME: 5,
    TOTAL_ROUNDS: 5
  }).status(200);
});

// check if the server is alive and return some data too
router.get("/status", (req, res) => {
  res.send({
    status: "alive",
    players: serverSocket.roomAssignments.length,
    games: serverSocket.gameRooms.length
  }).status(200);
});

// show the test page
router.get("/test", (req, res) => {
  res.render('test', {
    CLIENT_ENDPOINT,
    ENV
  });
});

export { router }