
import { RoomModel } from './models/room/room.js';
import { AutoRoomModel } from './models/room/autoRoom.js';
import { FullAutoRoomModel } from './models/room/fullAutoRoom.js';

angular.module('nuclear-codes-test', []).controller('testController', ['$scope', function ($scope) {

  // initialize
  $scope.init = () => {
    console.info(`Test for environment: ${ENV}`);
    const defaultRoomName = (ENV === "PRD") ? `test-${Date.now()}` : 'test';
    $scope.state = {
      roomName: defaultRoomName,
      playerCount: 7,
      rooms: []
    };
  }

  $scope.addRoom = () => {
    // TODO: if room exists, don't add room, just add more players to the existing room
    const { roomName, playerCount } = $scope.state;
    console.info('TEST', { roomName, playerCount });
    $scope.state.rooms.push(new RoomModel($scope, roomName, playerCount));
  }

  $scope.addAutoRoom = () => {
    const { roomName, playerCount } = $scope.state;
    console.info('AUTO TEST', { roomName, playerCount });
    $scope.state.rooms.push(new AutoRoomModel($scope, roomName, playerCount));
  }

  $scope.addFullAutoRoom = () => {
    const { roomName, playerCount } = $scope.state;
    console.info('FULL AUTO TEST', { roomName, playerCount });
    $scope.state.rooms.push(new FullAutoRoomModel($scope, roomName, playerCount));
  }

}]);
