const express = require("express");
const router = express.Router();

// TODO: this should serve the react build index page
router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.get("/gameInfo", (req, res) => {
  res.send({
    game: {
      id: "something",
      roomName: "name",
      players: [
        {}
      ]
    }
  }).status(200);
});

module.exports = router;