/*
  This file defines a utility for updating the application with the client's
  location information. It maintains the original structure of the creator and
  has been only slightly reformatted so that we can abstract the feature out from
  the ../app.js entry point of the application.
*/

import { store } from './storeConfig';

import * as userActions from '../actionCreators/user';
import * as rideActions from '../actionCreators/ride';

// @return ID<Number> of the watcher for later removal.
export default function initLocationWatcher() {
  navigator.geolocation.getCurrentPosition(updateLocation);

  return navigator.geolocation.watchPosition(updateLocation);
}

// index.html exposes google
const DirectionsService = new google.maps.DirectionsService();

function updateLocation({ coords /* = noCoordError() */ }) {
  if (!'geolocation' in navigator) {
    console.error('Device location is not available on this browser');
    return;
  }

  if (!coords) {
    console.error('Device did not provide location information. Please report to the team :~)');
    return;
  }

  const ride = store.getState().get('ride').toJS();
  const location = {
    lat: coords.latitude,
    lng: coords.longitude
  };

  if (!ride.match) {
    store.dispatch(userActions.setLocation(location));
  } else {
    store.dispatch(userActions.setLocation(location, ride.match));
    let destination = ride.match.location;

    if (ride.isPickedUp) {
      const user = store.getState().get('user').toJS();
      const friendRider = user.friends.find((friend) => friend.user_id === ride.match.user_id);

      if (user.isRider) destination = user.profile.address;
      else destination = friendRider.address;
    }

    DirectionsService.route({
      origin: location,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, function (result, status) {
        store.dispatch(rideActions.setDirections(result));
      }
    );
  }
}
