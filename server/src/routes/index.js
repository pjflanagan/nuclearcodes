
import express from 'express';

import { serverSocket } from '../index.js';

const router = express.Router();

// this could serve the react build index page
// but right now I want host the game on Netlify
// and this server on Heroku

// TODO: check alive route with no data?

router.get("/", (req, res) => {
  res.send({
    status: "alive",
    players: serverSocket.roomAssignments.length,
    games: serverSocket.gameRooms.length
  }).status(200);
});

router.get("/test", (req, res) => {
  res.render('test');
});

export { router }