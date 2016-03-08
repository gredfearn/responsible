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
//get all from chat. Not sure why, but maybe neccessary sometime down the road
ChatAPI.get('/chat', function(req, res){
  Chat.getChat()
    .then(sendStatusAndData(res, 200))
    .catch(sendStatusAndData(res, 500, 'Server error getting rides list')
})

//Get chat between two users
ChatAPI.get('/chat/:id', function(req, res){
  var id = req.params.id;
  Chat.getChatById(id)
    .then(message => res.send(message, 200))
});


io.sockets.on('connection', function(socket){
  socket.on('send message', function(data){
    io.sockets.emit('new message', data);
  });
});
