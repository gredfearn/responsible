require('../server-helpers');
var RideAPI = require('express').Router();
var io = require('socket.io')
var Ride = require(__models + '/ride');
var User = require(__models + '/user');

module.exports = RideAPI;

/*
GET all rides
POST new ride
POST new ride pair

*/
//Get all rides
RideAPI.get('/rides', function(req, res){
  Ride.getRides()
    .then(sendStatusAndData(res, 200))
    .catch(sendStatusAndData(res, 500, 'Server error getting rides list')
})

//Posting
RideAPI.post('/ride/:id', function(req, res){
  var user      = req.params.username
  var location  = req.params.location
  var timestamp = req.params.created_at
  Ride.createRide()
})
