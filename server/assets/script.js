
import { TestModel } from './models/test.js';

// test model
const test = new TestModel();


$(() => {

  // TODO: if production: add , and open test in new window

  // defaults
  const defaultRoomName = (ENV === "PRD") ? `test-${Date.now()}` : 'test';
  $('#roomName').val(defaultRoomName);
  $('#playerCount').val(5);

  // actions
  $("#startRoomForm").submit(function (event) {
    event.preventDefault();

    // get the data then disable
    const roomName = $('#roomName').val();
    const playerCount = $('#playerCount').val();
    $("#startRoomForm :input").prop("disabled", true);

    console.log({ roomName, playerCount });

    // send it to the model
    test.startTest(roomName, playerCount);
    createDisplay();
  });

});

function createDisplay() {
  test.players.forEach((p, i) => {
    $('#players').append(`
      <div class="player" id="player-${i}">
        <h2 id="player-${i}-name">${p.playerName}</h2>
        isSpy, connectStatus, disconnect, sendResponse
      </div>
    `);
  });
  updateDisplay();
}

function updateDisplay() {
  $('#players').children()
}

export { createDisplay, updateDisplay }