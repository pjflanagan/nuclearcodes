
import express from 'express';
import dotenv from 'dotenv';

import { serverSocket } from '../index.js';

const router = express.Router();

dotenv.config();
const { CLIENT_ENDPOINT, ENV, TEST_TOKEN } = process.env;

// checks if server is alive
router.get("/", (req, res) => {
  res.send({
    status: "alive"
  }).status(200);
});

// return the game rules and event types
// this will make shared data for server and client
// TODO: import CONSTANTS from CONSTANTS
router.get("/rules", (req, res) => {
  res.send({
    MIN_PLAYERS_PER_GAME: 5,
    TOTAL_ROUNDS: 5,
    // EVENTS: {
    //   POLL_RESPONSE: 1
    // }
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

// show the test page, no token
router.get("/test", (req, res) => {
  if (!!TEST_TOKEN) {
    // if there is a token required, deny request
    res.send({
      message: 'Permission Denied'
    });
    return
  }

  // otherwise show the page
  res.render('test', {
    CLIENT_ENDPOINT,
    ENV
  });
});

// show the test page, token provided
router.get("/test/:token", (req, res) => {
  const { token } = req.params;

  // if there is a token and the token is not correct
  if (!!TEST_TOKEN && token !== TEST_TOKEN) {
    res.send({
      message: 'Permission Denied'
    });
    return;
  }

  // otherwise show the page
  res.render('test', {
    CLIENT_ENDPOINT,
    ENV
  });
});

export { router }