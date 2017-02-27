export function handleUserInfo(state, action) {
  switch (action.type) {
    case 'REQUEST_USER_INFO':
      return requestUserInfo(state, action);
    case 'RECEIVE_USER_INFO':
      return receiveUserInfo(state, action);
    case 'REQUEST_USER_INFO_ERROR':
      return requestUserInfoError(state, action);
    case 'RECEIVE_FRIEND_INFO':
      return receiveFriendInfo(state, action);
    case 'ADDED_FRIEND':
      return addedFriend(state, action);
  }

  return state;
}

function requestUserInfo(state) {
  let updates = {
    isFetchingUserInfo: true,
  };

  return state.merge(updates);
}

function receiveUserInfo(state, { entry }) {
  // console.log('received user information from server:', entry);

  let newState;
  let userUpdates = {
    user_id: entry.user.user_id,
    isLoggedIn: true,
    isFetchingUserInfo: false,
    friends: entry.friends,
  };

  let profileUpdates = {
    avatar: entry.user.avatar,
    name: entry.user.name,
    address: entry.user.address,
  };

  let toSet = {
    friends: entry.friends,
    user: {
      user_id: entry.user.user_id,
      avatar: entry.user.avatar,
      name: entry.user.name,
      address: entry.user.address,
    },
  };

  localStorage.setItem('user', JSON.stringify(toSet));

  newState = state.mergeIn(['profile'], profileUpdates);
  newState = newState.merge(userUpdates);

  return newState;
}

function addedFriend(state, { entry }) {
  let updates = {
    addedFriend: entry,
  };

  return state.merge(updates);
}

function requestUserInfoError(state, { entry }) {
  let updates = {
    requestUserError: entry,
  };

  return state.merge(updates);
}

function receiveFriendInfo(state, { entry }) {
  let old = state.toJS().friends;
  let user = JSON.parse(localStorage.getItem('user'));

  console.log('received a new user:', entry);
  let newFriend = {
    avatar: entry.avatar,
    name: entry.name,
    user_id: entry.user_id,
    address: entry.address,
  };
  old.push(newFriend);
  console.log('new friends list:', old);
  user.friends.push(newFriend);

  localStorage.setItem('user', JSON.stringify(user));

  let updates = {
    isFetchingUserInfo: false,
    friends: old,
  };

  return state.merge(updates);
}
