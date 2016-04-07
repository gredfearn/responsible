require('../../test-helper');
const db = require('../../../lib/db');
const assert = require('chai').assert;
const routes = require(__server + '/index.js');
const dbCleaner = require('knex-cleaner');
const Ride = require(__models + '/rides');
const Seed = require('../../lib/seed_test');
var SeedObj = null;

describe('Rides Models', function () {

  beforeEach_(function * () {
    yield Seed.cleaner();
    SeedObj = yield* Seed.runner();
  });

  it_('Create a ride in rides table', function * () {
    var attrs = {
      ride_driver: SeedObj.driver1.foreign_driver,
      ride_rider: SeedObj.rider1.foreign_rider,
    };

    var rides = yield Ride.createRide(attrs);
    assert.typeOf(rides, 'object');
    assert.typeOf(rides.ride_id, 'number');
    assert.typeOf(rides.ride_driver, 'number');
    assert.typeOf(rides.ride_rider, 'number');
  });

  it_('Get all rides in ride table', function * () {
    var attrs = {
      ride_driver: SeedObj.driver1.foreign_driver,
      ride_rider: SeedObj.rider1.foreign_rider,
    };

    yield Ride.createRide(attrs);
    var rides = yield Ride.getRides();
    var ride = rides[0];
    assert.typeOf(rides, 'array');
    assert.lengthOf(rides, 1);
    assert.typeOf(ride, 'object');
    assert.typeOf(ride.ride_id, 'number');
    assert.typeOf(ride.ride_driver, 'number');
    assert.typeOf(ride.ride_rider, 'number');
    assert.typeOf(ride.completed, 'boolean');
    assert.typeOf(ride.canceled, 'boolean');
  });

  it_('Delete a Ride by rideId', function * () {
    var attrs = {
      ride_driver: SeedObj.driver1.foreign_driver,
      ride_rider: SeedObj.rider1.foreign_rider,
    };

    var ride = yield Ride.createRide(attrs);
    yield Ride.deleteRide(ride.ride_id);
    var getRide = yield Ride.getRides();
    assert.typeOf(getRide, 'array');
    assert.lengthOf(getRide, 0);
  });

  it_('Get Ride by Id', function * () {
    var attrs = {
      ride_driver: SeedObj.driver2.foreign_driver,
      ride_rider: SeedObj.rider2.foreign_rider,
    };

    var ride = yield Ride.createRide(attrs);
    var getId = yield Ride.getRideById(ride.ride_id);
    assert.typeOf(getId, 'object');
    assert.typeOf(getId.ride_id, 'number');
    assert.typeOf(getId.ride_driver, 'number');
    assert.typeOf(getId.ride_rider, 'number');
    assert.typeOf(getId.completed, 'boolean');
    assert.typeOf(getId.canceled, 'boolean');
  });

  it_('Get all Riders in riders table', function * () {
    var riders = yield Ride.getRiders();
    assert.typeOf(riders, 'array');
    assert.lengthOf(riders, 2);
    assert.typeOf(riders[0], 'object');
  });

  it_('Get rider in rider table by rider id', function * () {
    var rider = yield Ride.getRiderById(SeedObj.user1Id.user_id);
    var local = JSON.parse(rider.location);
    assert.typeOf(rider, 'object');
    assert.typeOf(rider.foreign_rider, 'number');
    assert.typeOf(local, 'object');
    assert.typeOf(local.lat, 'number');
  });

  it_('Create a new rider in the rider table', function * () {
    var attrs = {
      foreign_rider: SeedObj.user5Id.user_id,
      location: JSON.stringify({ lat: 30.263619, lng: -97.737909 }),
    };

    var rider = yield Ride.createRider(attrs);
    var local = JSON.parse(rider.location);

    assert.typeOf(rider, 'object');
    assert.typeOf(rider.foreign_rider, 'number');
    assert.typeOf(local, 'object');
    assert.typeOf(local.lng, 'number');
    assert.typeOf(local.lat, 'number');
  });

  it_('Should delete rider from rider table', function * () {
    var riders1 = yield Ride.getRiders();
    var rider1Id = riders1[0].user_id;
    assert.typeOf(riders1, 'array');
    assert.lengthOf(riders1, 2);
    assert.typeOf(riders1[0], 'object');
    assert.equal(riders1[0].user_id, rider1Id);

    yield Ride.deleteRider(rider1Id);
    var riders2 = yield Ride.getRiders();
    assert.typeOf(riders2, 'array');
    assert.lengthOf(riders2, 1);
    assert.typeOf(riders2[0], 'object');
    assert.notEqual(riders2[0].user_id, rider1Id);
  });

  it_('Get all user ids from drivers table', function * () {
    var drivers = yield Ride.getDrivers();
    assert.typeOf(drivers, 'array');
    assert.lengthOf(drivers, 2);
    assert.typeOf(drivers[0], 'number');
  });

  it_('Get a single driver by user_id', function * () {
    var driver = yield Ride.getDriverById(SeedObj.user3Id.user_id);
    assert.typeOf(driver, 'object');
    assert.equal(driver.foreign_driver, SeedObj.user3Id.user_id);
  });

  it_('Can create a new driver', function * () {
    var attrs = {
      userId: SeedObj.user5Id.user_id,
      location: { lat: 30.263619, lng: -97.737909 },
    };

    var driver = yield Ride.createDriver(attrs);
    assert.typeOf(driver, 'object');

    var getDrivers = yield Ride.getDrivers();
    assert.typeOf(getDrivers, 'array');
    assert.lengthOf(getDrivers, 3);
    assert.equal(getDrivers[2], SeedObj.user5Id.user_id);
  });

  it_('Delete driver by user id', function * () {
    var attrs = {
      userId: SeedObj.user5Id.user_id,
      location: { lat: 30.263619, lng: -97.737909 },
    };
    var driver = yield Ride.createDriver(attrs);
    assert.typeOf(driver, 'object');
    assert.equal(driver.foreign_driver, SeedObj.user5Id.user_id);

    yield Ride.deleteDriver(SeedObj.user5Id.user_id);
    var getDeleted = yield Ride.getDriverById(SeedObj.user5Id.user_id);
    assert.equal(getDeleted, undefined);
  });

  it_('Delete driver and rider by user ids', function * () {
    var drivers = yield Ride.getDrivers();
    var riders = yield Ride.getRiders();
    expect(drivers).to.be.instanceOf(Array);
    expect(drivers).to.have.length(2);
    expect(riders).to.be.instanceOf(Array);
    expect(riders).to.have.length(2);

    yield Ride.deleteRiderAndDriver(SeedObj.user1Id.user_id, SeedObj.user3Id.user_id);
    var drivers = yield Ride.getDrivers();
    var riders = yield Ride.getRiders();
    expect(drivers).to.be.instanceOf(Array);
    expect(drivers).to.have.length(1);
    expect(riders).to.be.instanceOf(Array);
    expect(riders).to.have.length(1);
  });
});
