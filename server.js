/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */

const barnowl = require('barnowl');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const HTTP_PORT = 3000;
const RAD_TO_DEG = 57.2958;


var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var middleware = new barnowl();

// Express web server initialisation
app.use(express.static('web'));
server.listen(HTTP_PORT, function () {
  console.log('Browse to localhost:' + HTTP_PORT + ' for the web demo');
});

middleware.bind( { protocol: 'serial', path: 'auto' } );

// Handle a BLE decoding
middleware.on('visibilityEvent', function(tiraid) {
  var hasData = (tiraid.identifier.hasOwnProperty('advData') &&
                 tiraid.identifier.advData.hasOwnProperty('serviceData'));

  if(hasData) {
    var serviceData = tiraid.identifier.advData.serviceData;
    var isAccelerometer = (serviceData.hasOwnProperty('minew') &&
                           (serviceData.minew.productModel === 3));

    if(isAccelerometer) {
      var id = tiraid.identifier.value;
      var angle = calculateAngle(serviceData.minew.accelerationX,
                                 serviceData.minew.accelerationY,
                                 serviceData.minew.accelerationZ);
      io.emit('angle', { id: tiraid.identifier.value, angle: angle });
    }
  }
});


/**
 * Calculate the angle.
 */
function calculateAngle(accelerationX, accelerationY, accelerationZ) {
  var acceleration = Math.sqrt((accelerationX * accelerationX) +
                               (accelerationY * accelerationY) +
                               (accelerationZ * accelerationZ));
  var normalX = accelerationX / acceleration;
  var normalY = accelerationY / acceleration;
  var normalZ = accelerationZ / acceleration;

  if((normalX <= 0) && (normalY >= 0)) {
    return RAD_TO_DEG * Math.atan(Math.abs(normalX) / Math.abs(normalY));
  }
  if((normalX <= 0) && (normalY <= 0)) {
    return 90 + (RAD_TO_DEG * Math.atan(Math.abs(normalY) / Math.abs(normalX)));
  }
  if((normalX >= 0) && (normalY <= 0)) {
    return 180 + (RAD_TO_DEG * Math.atan(Math.abs(normalX) / Math.abs(normalY)));
  }
  if((normalX >= 0) && (normalY >= 0)) {
    return 270 + (RAD_TO_DEG * Math.atan(Math.abs(normalY) / Math.abs(normalX)));
  }
}

