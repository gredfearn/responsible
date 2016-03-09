import { Link } from 'react-router';

// This function will dispatch action to change to Profile View
function nullFn(e) { console.log('you clicked me ' + e.target.className); };

export function ProfileButton({
  onProfileButtonClick = nullFn,
}) {
  return (
    <div className='ProfileButton' onClick={onProfileButtonClick}>
      <button className='ProfileButton btn'>
        <Link to="/profile">Profile</Link>
      </button>
    </div>
  );
}
