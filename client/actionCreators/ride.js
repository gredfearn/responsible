
export function requestPair() {
  // initiate a server request for pair.
  // using thunk middleware
  return {
    type: 'REQUEST_MATCH',
  };
};

export function receivePair(userObj) {
  return {
    type: 'RECEIVE_MATCH',
    entry: userObj,
  };
};

export function cancelRide() {
  // tell the server!
  return {
    type: 'CANCEL_RIDE',
  };
};
