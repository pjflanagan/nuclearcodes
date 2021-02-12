
import { RoomModel } from './models/room/room.js';
import { AutoRoomModel } from './models/room/autoRoom.js';
import { FullAutoRoomModel } from './models/room/fullAutoRoom.js';

angular.module('nuclear-codes-test', []).controller('testController', ['$scope', '$http', function ($scope, $http) {

  // initialize
  $scope.init = () => {
    console.info(`Test for environment: ${ENV}`);
    const defaultRoomName = (ENV === "PRD") ? `test-${Date.now()}` : 'test';
    $scope.state = {
      roomName: defaultRoomName,
      playerCount: 7,
      rooms: [],
      serverStatus: {
        status: "alive",
        players: 0,
        games: 0
      }
    };

    $scope.getStatus();
    setInterval($scope.getStatus, 5000);
  }

  $scope.getStatus = () => {
    $http({
      method: 'GET',
      url: '/status'
    }).then(function successCallback({ data }) {
      $scope.serverStatus = data;
    }, function errorCallback(response) {
      console.error(response);
    });

  }

  $scope.addRoom = (roomType) => {
    const { roomName, playerCount } = $scope.state;

    switch (roomType) {
      case 'auto':
        console.info('AUTO TEST', { roomName, playerCount });
        $scope.state.rooms.push(new AutoRoomModel($scope, roomName, playerCount));
        break;
      case 'full-auto':
        console.info('FULL AUTO TEST', { roomName, playerCount });
        $scope.state.rooms.push(new FullAutoRoomModel($scope, roomName, playerCount));
        break;
      default:
        console.info('TEST', { roomName, playerCount });
        $scope.state.rooms.push(new RoomModel($scope, roomName, playerCount));
    }

    const newRoomName = (ENV === "PRD") ? `test-${Date.now()}` : `test-${$scope.state.rooms.length}`;
    $scope.state.roomName = newRoomName;
  }

}]);
