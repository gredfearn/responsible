import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fromJS } from 'immutable';

// import { ProfileContainer } from './containers/ProfileContainer';
import { TopNavBarContainer } from './containers/TopNavBarContainer';
import rootReducer from './reducers/rootReducer';
import { WrappedProfile } from './containers/ProfileContainer';

const dummyState = {
  user: {
    id: 1,
    avatar: 'https://i.ytimg.com/vi/1v6M41Divso/maxresdefault.jpg',
    fullName: 'Kim Panda',
    street: 'back handle lane',
    city: 'Austin',
    state: 'Virginia',
    zip: '56352',
  },
  friends: [
    {
      id: 2,
      avatar: 'http://www.spirit-animals.com/wp-content/uploads/2012/09/Dolphin.jpg',
      fullName: 'Flipp',
    },
    {
      id: 7,
      avatar: 'http://vignette3.wikia.nocookie.net/pokemon/images/1/' +
              '16/025Pikachu_OS_anime_10.png/revision/20150102074354',
      fullName: 'PIKA',
    },
  ],
  profileInfoItems: [
    { itemTitle: 'Austin' },
    { itemDesc: 'Virginia' },
  ],
};

const store = createStore(rootReducer, fromJS(dummyState));

const dummyFlags = {
  flags: {
    isDriver: false,
    isRider: true,
    isMatched: false,
    isConfirmed: false,
  },
};

ReactDOM.render(
  <Provider store={store}>
    <WrappedProfile />
  </Provider>,

  /* Rendering two containers throws error; will need to render specific ones based on state */

  // <ProfileContainer {...dummyState} />,
  // <TopNavBarContainer {...dummyState} {...dummyFlags} />,
  document.getElementById('app')
);
