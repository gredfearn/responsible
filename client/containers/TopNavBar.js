import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { MenuItem, Dropdown, Glyphicon } from 'react-bootstrap';

import { TopNavBarRightButton } from '../components/TopNavBar/RightButton';

import * as userAction from '../actionCreators/user';
import * as rideAction from '../actionCreators/ride';
import * as driveAction from '../actionCreators/drive';

function TopNavBar({ onCancel, onEndDriver, onPickUp, onComplete, onProfileButtonClick,
  onHomeClick, onFriendButtonClick, onSignoutButtonClick, ...props, }) {
  let { ride, user } = props;

  let endDriver = onEndDriver.bind(null, user.user_id);

  let cancelClick;
  if (ride.match) {
    cancelClick = onCancel.bind(null, ride.match.user_id, ride.ride_id);
    onPickUp = onPickUp.bind(null, ride.match.user_id);
    onComplete = onComplete.bind(null, user.user_id, ride.match.user_id, user.location);
  } else
    cancelClick = onCancel.bind(null, user.user_id, null);

  return (
    <div className="nav">
      <Dropdown bsStyle="info" className="settings" id="nav bar">
        <Dropdown.Toggle noCaret>
          <Glyphicon glyph="align-justify" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem eventKey="4.1" onClick={onProfileButtonClick}>Profile</MenuItem>
          <MenuItem eventKey="4.2" onClick={onFriendButtonClick}>Friends</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4.3" onClick={onSignoutButtonClick}>Signout</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
      <img src="http://s10.postimg.org/mnt5sb8bd/Drawing_11.png" className="mainTitle" width="27px" onClick={onHomeClick}/>
      <TopNavBarRightButton
        {...props}
        onCancel={cancelClick}
        onEndDriver={endDriver}
        onPickUp={onPickUp}
        onComplete={onComplete}
      />
    </div>
  );
}

const mapStateToProps = function (state) {
  return state.toJS();
};

// jscs:disable
const mapDispatchToProps = function (dispatch) {
  // TODO: determine function callbacks based on match here!
  return {
    onProfileButtonClick() {
      dispatch(push('/profile'))
    },
    onCancel: (user_id, ride_id) => {
      // Our current approach is to modify onCancel in the rendering of our
      // component - a better approach might be to augment that here, where we have access
      // to the component's next props through the second parameter of mapDispatchToProps

      // console.log('dispatching cancel:', user_id, ride_id);
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
