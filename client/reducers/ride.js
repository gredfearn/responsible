import { Map } from 'immutable';

import { handleCancel } from './cancelRide';
import { handleConfirm } from './confirmRide';
import { handleRideFetch } from './fetchRide';
import { handleMessages } from './rideMessages';
import { handleRiders } from './riders';
import { handleDriver } from './drivers';

// The state passed to this reducer is state.ride
export default function(state = Map(), action) {

  // console.log('reducing ride state:', state.toJS());
  switch (action.type) {
    case 'REQUEST_RIDE':
    case 'RECEIVE_RIDE_ID':
    case 'RECEIVE_RIDE':
    case 'REQUEST_RIDE_ERROR':
      return handleRideFetch(state, action);
    case 'ACCEPT_RIDE_SUCCESS':
    case 'ACCEPT_RIDE_SENT':
    case 'ACCEPT_RIDE_ERROR':
      return handleConfirm(state, action);
    case 'CANCEL_RIDE':
    case 'CANCEL_RIDE_SENT':
    case 'CANCEL_RIDE_ERROR':
      return handleCancel(state, action);
    case 'REMOVE_RIDER':
    case 'ADD_RIDER':
      return state.mergeIn(['riders'], handleRiders(state.get('riders'), action));
    case 'REQUEST_MESSAGES':
    case 'RECEIVE_MESSAGES':
    case 'REQUEST_MESSAGES_ERROR':
    case 'ADD_MESSAGE':
      return handleMessages(state, action);
    case 'SET_DIRECTIONS':
      return setDirections(state, action);
    case 'ADD_DRIVER_SENT':
    case 'ADD_DRIVER':
    case 'ADD_DRIVER_ERROR':
      return handleDriver(state, action);
    case 'REMOVE_DRIVER_SENT':
    case 'REMOVE_DRIVER':
    case 'REMOVE_DRIVER_ERROR':
      return handleDriver(state, action);

    // HANDLE USER LOGGING OUT!
  };

  return state;
}

function setDirections(state, action) {
  let updates = {
    directions: action.entry,
  };

  return state.merge(updates);
}
