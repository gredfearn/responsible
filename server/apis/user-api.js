require('../server-helpers');
var UserAPI = require('express').Router();

var Ride = require(__models + '/ride');
var User = require(__models + '/user');

module.exports = UserAPI;

//Get all users
UserAPI.get('/user', function(req, res){
  User.getUsers()
    .then(users => res.send(users))
    .catch(err => console.log(err))
});

//Get User by ID
UserAPI.get('/user/:id', function(req, res){
  User.findUserById(req.params.id)
    .then(user => res.send(user, 200))
    .catch(err => console.log('no such user', err))
});

//Create a user
UserAPI.post('/user', function(req, res){
  var user = req.body
  User.createUser(user)
    .then( () => console.log('sent create user request to database'))
    .catch( () => console.log('error creating user'))
})

UserAPI.put('/user/:id', function(req, res){
  var id = req.params.id;
  User.updateById(id, request.body)
    .then( () => User.findByID(id))
    .then( user => res.send(user));
});





