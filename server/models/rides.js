require('../server-helpers');
var db      = require('../../lib/db.js');
const R = require('ramda');
const Friends = require(__models + '/friends');
const TempStorage = require(__models + '/TempStorage');

var Ride = {};
module.exports = Ride;

//Collecting all the matched rides in the database
Ride.getRides = function () {
  return db.select('*').from('rides')
    .catch(reportError('error getting all rides'))
    .then(rides => rides);
};

//Creates a ride between two users
Ride.createRide = function (attrs) {
  return db('rides').insert(attrs, ['ride_id', 'foreign_driver', 'foreign_rider'])
    .catch(reportError('error creating ride in db'))
    .then(ride => ride);
};

//Deletes a ride by id
Ride.deleteRide = function (id) {
  return db('rides').where({ ride_id: id }).del()
    .catch(reportError('error deleting ride by id'))
    .then(ride => console.log('deleted ride with id ' + id));
};

//Gets all available drivers who are also friends of userId
Ride.getAvailableDrivers = function (userId) {
  return R.intersection(TempStorage.availableDrivers, Friends.getFriendsIds());
};

