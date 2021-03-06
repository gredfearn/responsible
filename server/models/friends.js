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

/*
  Checks for a friendship between users.
*/
Friends.usersAreFriends = function (user_id, partner_id) {
  return db('friends')
    .where(function () {
      this.where({ foreign_friend1: user_id })
        .andWhere({ foreign_friend2: partner_id });
    }).orWhere(function () {
      this.where({ foreign_friend1: partner_id })
        .andWhere({ foreign_friend2: user_id });
    })
    .then(function (friendship) {
      return !!friendship[0];
    });
};

Friends.findAndAddFriend = function (user_id, searchString) {
  return User.findUserIdByName(searchString)
    .then(function (partner) {
      // if user is undefined, jump out!
      if (!partner)
        throw new Error('Did not find user: ' + searchString);

      return Friends.usersAreFriends(user_id, partner.user_id)
        .then(function (alreadyFriends) {
          if (alreadyFriends) throw new Error('You already already friends!');
          else return Friends.createFriendship(user_id, partner.user_id);
        });
    })
    .then(function (friendID) {
      return User.findUserById(friendID.foreign_friend2);
    })
    .catch(function (error) {
      console.log('error adding friends:', error.message);
      return { error: error.message };
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
