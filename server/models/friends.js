require('../server-helpers');
var db      = require('../../lib/db.js');

var Friends = {};
module.exports = Friends;

//Returns an array of friends
Friends.getFriendIds = function (userId) {
  return db.select('*').from('friends')
    .where({ foreign_friend1: userId }).orWhere({ foreign_friend2: userId })
    .catch(reportError('error retrieving friends by userId'))
    .then(Friends.filterFriends(friends))
    .then(function (friends) {
      return friends.map(friend => Friends.filterFriends(userId, friend));
    });
};

//Filters through a friend object and returns friend id
Friends.filterFriends = function (userId, friend) {
  if (friend.foreign_friend1 === userId) {
    return friend.foreign_friend2;
  } else {
    return friend.foreign_friend1;
  }
};

