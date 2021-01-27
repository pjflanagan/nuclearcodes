
import { TestModel } from './models/test.js';

$(() => {

  // TODO: if production: add , and open test in new window

  // defaults
  const defaultRoomName = (ENV === "PRD") ? `test-${Date.now()}` : 'test';
  $('#roomName').val(defaultRoomName);
  $('#playerCount').val(5);

  // test model
  const test = new TestModel();

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
  });

});
