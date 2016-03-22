'use strict';
require('./model-helpers');
const db      = require('../../lib/db.js');
const User = require(__models + '/user');
const Ride = require(__models + '/rides');
const R = require('ramda');

const Friends = {};
module.exports = Friends;

// jscs: disable
Friends.createFriendship = function (user_id1, user_id2) {
  return db('friends').insert({
    foreign_friend1: user_id1,
    foreign_friend2: user_id2
  }, ['foreign_friend2'])
  .then((user) => user[0]);

  //KK: I don't know what this R.first is doing
  // .then(R.first);
};
// jscs: enable

//Returns an array of friend ids
Friends.getFriendIds = function (user_id) {
  return db('friends').select('*')
    .where({ foreign_friend1: user_id }).orWhere({ foreign_friend2: user_id })
    .catch(reportError('error retrieving friends by userId' + user_id))
    .then(function (friendRows) {
      return friendRows.map(function (friendRow) {
        return friendRow.foreign_friend1 === user_id ?
          friendRow.foreign_friend2 :
          friendRow.foreign_friend1;
      });
    });
};

Friends.findAndAddFriend = function (user_id, searchString) {
  return User.findUserIdByName(searchString)
    .then(function (user) {
      // if user is undefined, jump out!
      if (!user)
        throw new Error('Did not find user by searchstring: ' + searchString);

      return Friends.createFriendship(user_id, user.user_id);
    })
    .then(function (friendID) {
      return User.findUserById(friendID.foreign_friend2);
    })
    .catch(function (error) {
      console.error(error.message);
      return null;
    });
};

// Takes in user_id, returns intersection array of available drivers and friends
Friends.getFriendDrivers = function (userId) {
  let friends = null;
  let drivers = null;

  return Friends.getFriendIds(userId)
    .then(function (_friends) {
      friends = _friends;
    })
    .then(Ride.getDrivers)
    .then(function (driveArray) {
      drivers = driveArray;
    })
    .then(() => R.intersection(friends, drivers))
    .catch(reportError('Error getting drivers who are a friend of ' + userId));
};

// Takes in user_id, returns intersection array of available friend riders
Friends.getFriendRiders = function (userId) {
  let friends = null;
  let riders = null;

  return Friends.getFriendIds(userId)
    .then(function (_friends) {
      friends = _friends;
    })
    .then(Ride.getRiders)
    .then(function (rideArray) {
      riders = rideArray;
    })
    .then(() => Friends.intersection(friends, riders))
    .catch(function (err) {
      console.log('error', err);
    });
};

Friends.intersection = function (friends, riders) {
  let RiderIds = riders.map((rider) => rider.user_id);
  let friendRiderIds = R.intersection(friends, RiderIds);

  return riders.filter((rider) => (friendRiderIds.indexOf(rider.user_id) !== -1));
};
