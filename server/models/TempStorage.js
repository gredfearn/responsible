var R = require('ramda');
var Friends = require(__models + '/friends');

var TempStorage = {};

TempStorage.usersLookingForRide = [];

TempStorage.availableDrivers = [];

module.exports = TempStorage;

