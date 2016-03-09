var db      = require('../../lib/db.js');
const first = require('ramda').head;

var User = {};
module.exports = User;

User.getUsers = function () {
  return db.select('user').from('users');
};

User.findUserById = function (userId) {
  return db.select('username').from('users').where({ id: UserId })
    .catch(reportError('error retrieving username by userId'))
    .then(first);
};

User.deleteUserById = function (userId) {
  return db('user').where({ id: userId }).del()
    .then(user => console.log('deleted user with id' + userId))
    .catch(reportError('error deleting user by id'));
};

User.createUser = function (attrs) {
  return db('user').insert(attrs, ['id', 'username', 'first_name']);
};

/*
User.find
User.findByID
User.updateByID
*/
