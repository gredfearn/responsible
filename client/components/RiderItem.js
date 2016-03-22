import { UserImage } from './UserImage';

export function RiderItem({ user_id, location, onRiderItemClick }) {
  return (
    <div className="riderItem" onClick={onRiderItemClick}>
      <div className="rider_id">{user_id}</div>
      <div className="lat">{location.lat}</div>
      <div className='lng'>{location.lng}</div>
    </div>
    );
};
