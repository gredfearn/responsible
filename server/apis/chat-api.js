require('../server-helpers');
var ChatAPI = require('express').Router();
var io      = require('socket.io');

var Chat = require(__models + '/chat');

module.exports = ChatAPI;

/*
Incorporate Socket.io
Need POST
Need GET
*/
ChatAPI.get('/rides', function(req, res){
  Ride.getRides()
    .then(sendStatusAndData(res, 200))
    .catch(sendStatusAndData(res, 500, 'Server error getting rides list')
})


io.sockets.on('connection', function(socket){
  socket.on('send message', function(data){
    io.sockets.emit('new message', data);
  });
});
