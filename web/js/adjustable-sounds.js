/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things.
 */

const KNOB_BASE_CLASSES = 'img-responsive center-block';

angular.module('adjustable-sounds', [ 'ui.bootstrap' ])

  // Experience controller
  .controller('ExperienceCtrl', function($scope, $location) {
    var url = $location.protocol() + '://' + $location.host() + ':' +
              $location.port();
    var socket = io.connect(url);

    $scope.beacons = [];
    $scope.knobs = {
      a: { classes: KNOB_BASE_CLASSES },
      b: { classes: KNOB_BASE_CLASSES },
      c: { classes: KNOB_BASE_CLASSES }
    };

    initiatePlayers();

    socket.on('angle', function(data) {
      var angleString = '-!-';
      var knob;

      if($scope.beacons.indexOf(data.id) < 0) {
        handleNewBeacon(data.id);
      }
      if(data.angle !== null) {
        angleString = data.angle.toFixed(0);
      }
      if($scope.knobs.a.id === data.id) {
        knob = $scope.knobs.a;
      }
      else if($scope.knobs.b.id === data.id) {
        knob = $scope.knobs.b;
      }
      else if($scope.knobs.c.id === data.id) {
        knob = $scope.knobs.c;
      }
      if(knob === null) {
        return;
      }
      knob.angle = data.angle;
      knob.angleString = angleString;
      knob.classes = setClasses(data.angle);
      updateVolume(knob.player, data.angle);
      $scope.$apply();
    });

    function handleNewBeacon(id) {
      $scope.beacons.push(id);
      if($scope.beacons.length === 1) {
        $scope.knobs.a.id = id;
      }
      else if($scope.beacons.length === 2) {
        $scope.knobs.b.id = id;
      }
      else if($scope.beacons.length === 3) {
        $scope.knobs.c.id = id;
      }
    }

    function updateVolume(player, angle) {
      player.volume.value = (angle / 15) - 24;
    }

    function setClasses(angle) {
      if((angle > 15) && (angle <= 45)) {
        return KNOB_BASE_CLASSES + ' img-rotate-30';
      }
      else if((angle > 45) && (angle <= 75)) {
        return KNOB_BASE_CLASSES + ' img-rotate-60';
      }
      else if((angle > 75) && (angle <= 105)) {
        return KNOB_BASE_CLASSES + ' img-rotate-90';
      }
      else if((angle > 105) && (angle <= 135)) {
        return KNOB_BASE_CLASSES + ' img-rotate-120';
      }
      else if((angle > 135) && (angle <= 165)) {
        return KNOB_BASE_CLASSES + ' img-rotate-150';
      }
      else if((angle > 165) && (angle <= 195)) {
        return KNOB_BASE_CLASSES + ' img-rotate-180';
      }
      else if((angle > 195) && (angle <= 225)) {
        return KNOB_BASE_CLASSES + ' img-rotate-210';
      }
      else if((angle > 225) && (angle <= 255)) {
        return KNOB_BASE_CLASSES + ' img-rotate-240';
      }
      else if((angle > 255) && (angle <= 285)) {
        return KNOB_BASE_CLASSES + ' img-rotate-270';
      }
      else if((angle > 285) && (angle <= 315)) {
        return KNOB_BASE_CLASSES + ' img-rotate-300';
      }
      else if((angle > 315) && (angle <= 345)) {
        return KNOB_BASE_CLASSES + ' img-rotate-330';
      }
      return KNOB_BASE_CLASSES;
    }

    function initiatePlayers() {
      $scope.knobs.a.player = new Tone.Player("../audio/loopA.mp3").toMaster();
      $scope.knobs.b.player = new Tone.Player("../audio/loopB.mp3").toMaster();
      $scope.knobs.c.player = new Tone.Player("../audio/loopC.mp3").toMaster();
      $scope.knobs.a.player.autostart = true;
      $scope.knobs.b.player.autostart = true;
      $scope.knobs.c.player.autostart = true;
      $scope.knobs.a.player.loop = true;
      $scope.knobs.b.player.loop = true;
      $scope.knobs.c.player.loop = true;
    }

  });
