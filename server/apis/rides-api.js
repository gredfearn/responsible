require('../server-helpers');
var RideAPI = require('express').Router();

var io = require('../lib/ioConfig').io;
if (process.env.NODE_ENV === 'test') {
  // jscs: disable
  // might as well disable any other code style checking, too, this is hacky enough
  var MockedSocketIO = {};
  MockedSocketIO.sockets = [];
  MockedSocketIO.to = function () {};
  MockedSocketIO.emitTo = function () {};
  MockedSocketIO.to.emit = function () {};

  io = MockedSocketIO;
  // jscs: enable
}

var Ride = require(__models + '/rides');
var Friends = require(__models + '/friends');
var User = require(__models + '/user');

module.exports = RideAPI;

/*
* Rides routes
*/

//Posting
RideAPI.post('/', function (req, res) {
  var ride = req.body;
  Ride.createRide(ride)
    .then(sendStatusAndData(res, 201))
    .catch(sendStatusAndError(res, 500, ('error creating user')));
});

/*
  Removes a ride or rider from the database.

  Effectively ends an ongoing ride or cancel a request for a ride.

  expects req.body:
    { user_id (current user) }
        OR
    { user_id (partner to inform of cancellation), ride_id }
  depending on whether it is a ride in progress of just a request for one.
*/
RideAPI.delete('/', function (req, res) {
  console.log('removing ride(r) by id:', req.body);
  var user_id = req.body.user_id;
  var ride_id = req.body.ride_id;

  var rideExists = false;
  if (ride_id) rideExists = true;

  if (rideExists) {
    Ride.deleteRide(ride_id)

      // user_id is the cancelling user's partner's user_id
      .then(() => io.to(user_id).emit('cancel_ride', null))
      .then(sendStatus(res, 200))
      .catch(sendStatusAndError(res, 500));
  } else {
    Ride.deleteRider(user_id)
      .then(Friends.getFriendDrivers.bind(null, user_id))
      .then((drivingFriends) => io.emitTo(drivingFriends, 'remove_rider', user_id))
      .then(sendStatus(res, 200))
      .catch(sendStatusAndError(res, 500));
  }
});

/*
* Rider routes
*/

// expects req.body: { userId, location }
// response: { }
RideAPI.post('/riders', function (req, res) {
  var attrs = req.body;
  var rider = null;
  var _location = req.body.location;

  var riderToInsert = {
    foreign_rider: req.body.userId,
    location: req.body.location,
  };

  Ride.createRider(riderToInsert)
    .then(function (newRider) {
      return User.findUserById(newRider[0].foreign_rider);
    })
    .then(function (user) {
      rider = user;
      rider.location = _location;
      return Friends.getFriendDrivers(rider.user_id);
    })
    .then(function (friendDrivers) {
      io.emitTo(friendDrivers, 'add_rider', rider);
      return rider;
    })
    .catch(sendStatusAndError(res, 500, 'error emiting new rider'))
    .then(sendStatus(res, 202));
});

/*
* Driver routes
*/

// Post Driver
RideAPI.post('/drivers', function (req, res) {
  var attrs = req.body;
  Ride.createDriver(attrs)
    .then((driver) => Friends.getFriendRiders(driver.foreign_driver))
    .then(function (data) {
      console.log('what is this data?', data);
    })
    .then(sendStatusAndData(res, 201))
    .catch(sendStatusAndError(res, 500, 'error creating driver'));
});

RideAPI.delete('/drivers', function (req, res) {
  var id = req.body;
  console.log('Delete Driver req.body', id);
  Ride.deleteDriver(id)
    .then(sendStatusAndData(res, 201))
    .catch(sendStatusAndError(res, 500, 'error deleting driver'));
});
