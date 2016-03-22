import { connect } from 'react-redux';

import{ RiderItem } from '../components/RiderItem';
import * as rideActions from '../actionCreators/ride';

function nullFn(e) { console.log('you clicked me ' + e.target.className); };

export function List({ riders, onRiderClick=nullFn, }) {
  return (
    <div className="riderList">
    <h1>Friends Waiting for Rides!</h1>
      {
        riders.map(function (rider) {
          console.log('key', rider.user_id);
          return <RiderItem
            key={rider.user_id}
            onRiderItemClick={onRiderClick}
            {...rider}
          />;
        })
      }
    </div>
  );
};

const mapStateToProps = function (state) {
  // console.log('main container mapStateToProps state:', state.toJS());
  return state.toJS();
};

const mapDispatchToProps = function (dispatch) {
  return {
    onRiderClick() {
      dispatch(rideAction.matchRider);
    },

  };
};

export const RiderItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
