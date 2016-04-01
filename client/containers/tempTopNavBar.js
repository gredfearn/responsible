import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { MenuItem, Dropdown, Glyphicon } from 'react-bootstrap';

import { Logo } from '../components/TopNavBar/Logo';
import { TopNavBarRightButton } from '../components/TopNavBar/RightButton';

import * as userAction from '../actionCreators/user';
import * as rideAction from '../actionCreators/ride';
import * as driveAction from '../actionCreators/drive';

function TopNavBar({ ride, user, ...onClicks }) {
  let match = ride.match;
  let endDriver = onClicks.onEndDriver.bind(null, user.user_id);
  let cancelClick;
  let pickUp;
  let complete;

  if (match) {
    cancelClick = onClicks.onCancel.bind(null, match.user_id, ride.ride_id);
    pickUp = onClicks.onPickUp.bind(null, match.user_id);
    complete = onClicks.onComplete.bind(null, user.user_id, match.user_id, user.location);
  } else
    cancelClick = onClicks.onCancel.bind(null, user.user_id, null);

  return (
    <div className="nav">
      <Dropdown bsStyle="info" className="settings" id="nav bar">
        <Dropdown.Toggle noCaret>
          <Glyphicon glyph="align-justify" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem eventKey="4.1" onClick={onClicks.onProfileButtonClick}>Profile</MenuItem>
          <MenuItem eventKey="4.2" onClick={onClicks.onFriendButtonClick}>Friends</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4.3" onClick={onClicks.onSignoutButtonClick}>Signout</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
      <img
        src="http://s10.postimg.org/mnt5sb8bd/Drawing_11.png"
        className="mainTitle"
        width="27px"
        onClick={onClicks.onHomeClick}
      />
      <TopNavBarRightButton
        ride={ride}
        user={user}
        onCancel={cancelClick}
        onEndDriver={endDriver}
        onPickUp={pickUp}
        onComplete={complete}
      />
    </div>
  );
}

const mapStateToProps = function (state) {
  return state.toJS();
};

// jscs:disable
const mapDispatchToProps = function (dispatch) {
  return {
    onProfileButtonClick() {
      dispatch(push('/profile'))
    },
    onCancel: (user_id, ride_id) => {
      // Our current approach is to modify onCancel in the rendering of our
      // component - a better approach might be to augment that here, where we have access
      // to the component's next props through the second parameter of mapDispatchToProps
      console.log('dispatching cancel:', user_id, ride_id);
      dispatch(rideAction.cancelRide({ user_id, ride_id }));
    },
    onEndDriver(user_id) {
      dispatch(driveAction.deleteDriver(user_id));
    },
    onPickUp(partner_id) {
      dispatch(rideAction.pickUp(partner_id));
    },
    onComplete(user_id, partner_id, user_location) {
      dispatch(rideAction.completeRide(partner_id));
      dispatch(driveAction.createDriver(user_id, user_location));
    },
    onHomeClick() {
      dispatch(push('/'));
    },
    onFriendButtonClick() {
      dispatch(push('/friends'));
    },
    onSignoutButtonClick() {
      OAuth.clearCache();
      localStorage.clear();
      dispatch(push('/login'));
      dispatch(userAction.signout(false));
    },
  };
};
// jscs:enable

export const TopNavBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopNavBar);
