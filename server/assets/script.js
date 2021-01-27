
import { RoomModel } from './models/room.js';

angular.module('nuclear-codes-test', []).controller('testController', ['$scope', function ($scope) {

  // initialize
  $scope.init = () => {
    console.log(`Test for environment: ${ENV}`);
    const defaultRoomName = (ENV === "PRD") ? `test-${Date.now()}` : 'test';
    $scope.state = {
      roomName: defaultRoomName,
      playerCount: 5,
      rooms: []
    };
  }

  $scope.addRoom = () => {
    // TODO: if room exists, don't add room, just add more players to the existing room
    const { roomName, playerCount } = $scope.state;
    console.log({ roomName, playerCount });

    const newRoom = new RoomModel();
    newRoom.startRoom(roomName, playerCount);
    $scope.state.rooms.push(newRoom);
    console.log($scope.state);
  }

}]);
