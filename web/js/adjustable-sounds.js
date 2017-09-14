/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things.
 */

angular.module('adjustable-sounds', [ 'ui.bootstrap' ])

  // Experience controller
  .controller('ExperienceCtrl', function($scope, $location) {
    var url = $location.protocol() + '://' + $location.host() + ':' +
              $location.port();
    var socket = io.connect(url);

    var player = new Tone.Player("../audio/loop.mp3").toMaster();
    player.autostart = true;
    player.loop = true;

    socket.on('angle', function(data) {
      $scope.angle = data.angle;
      $scope.id = data.id;
      player.volume.value = 0 - (data.angle / 30);
      $scope.$apply();
    });
  });
