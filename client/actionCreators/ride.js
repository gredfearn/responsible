import fetch from 'isomorphic-fetch';
import { headers, json, checkStatus } from '../lib/fetchHelpers';

/**
 *  Initializes a ride request. Alerts the server and waits
 *  to receive its upcoming ride Id.
**/
export function fetchRide(userId, location) {
  return (dispatch) => {
    dispatch(requestRide());

    fetch('/rides/riders', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ userId, location }),
    })
      .then(checkStatus)
      .catch((error) => dispatch(requestRideError(error)));
  };
};

/*
  Sends a request to the server to cancel an in-progress
  or pending ride request.

  expects: an object with _EITHER_
    userId or rideId

  When a ride has been requested but not matched, submit
  their userId to have it removed from the riders table.
  When a rider has been matched, submit their rideId to
  remove it from the rides table.
*/
export function cancelRide({ user_id, ride_id }) {
  console.log('canceling ride with object:', user_id, ride_id);
  return (dispatch) => {
    dispatch(cancelRideSent());

    fetch('/rides', {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({ user_id, ride_id }),
    })
      .then(checkStatus)
      .then(() => dispatch(cancelRideSuccess()))
      .catch((error) => dispatch(cancelRideError(error)));
  };
};

/**
 *  As a driver, accepts a ride by the rider's Id and passes our current
 *  location to the server.
**/
export function acceptRide(ride_driver, ride_rider) {
  return function (dispatch) {
    dispatch(acceptRideSent());
    console.log('ride stuff", ride_driver, ride_rider');

    //   fetch('/rides', {
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify({ ride_driver, ride_rider }),
    //   })
    //     .then(checkStatus)
    //     .then(json)
    //     .then((body) => dispatch(acceptRideSuccess(body)))
    //     .catch((error) => dispatch(acceptRideError(error)));
    // };
  };
};

// confirm ride receives a rideId, the partner's object, and the partner's location
export function acceptRideSuccess(body) {
  return { type: 'ACCEPT_RIDE_SUCCESS', entry: body, };
};

function acceptRideSent() {
  return { type: 'ACCEPT_RIDE_SENT', };
};

function acceptRideError(error) {
  console.error('uh oh, error accepting ride:', error);
  return { type: 'ACCEPT_RIDE_ERROR', entry: error };
};

function requestRide() {
  return { type: 'REQUEST_RIDE', };
};

// I don't think this will happen anymore because we do not initialize a ride
// table entry on requesting a ride.
function receiveRideId(rideId) {
  return { type: 'RECEIVE_RIDE_ID', entry: rideId, };
};

function requestRideError(error) {
  console.error('uh oh, error requesting ride');
  return { type: 'REQUEST_RIDE_ERROR', entry: error, };
};

export function receiveRide(userObj) {
  return { type: 'RECEIVE_RIDE', entry: userObj, };
};

export function cancelRideSuccess() {
  return { type: 'CANCEL_RIDE' };
};

function cancelRideSent() {
  return { type: 'CANCEL_RIDE_SENT' };
}

function cancelRideError(error) {
  console.error('uh oh, error canceling ride');
  return { type: 'CANCEL_RIDE_ERROR', entry: error, };
};

// rider: { userId, location, name }
// OR
// rider: [ {userId, location, name}, ... ]
export function addRider(rider) {
  return { type: 'ADD_RIDER', entry: rider, };
};

// Removes a rider from a driver's list of riders.
export function removeRider(riderId) {
  return { type: 'REMOVE_RIDER', entry: riderId };
};

export function setDirections(directions) {
  return { type: 'SET_DIRECTIONS', entry: directions };
}
