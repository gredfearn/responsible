import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fromJS } from 'immutable';

import Root from './containers/root';
import { TopNavBarContainer } from './containers/TopNavBar';
import { ProfileContainer } from './containers/Profile';
import rootReducer from './reducers/rootReducer';

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
  drivers: [
    {
      id: 10,
      avatar: 'http://animaliaz-life.com/data_images/dog/dog7.jpg',
      fullName: 'Barkdog',
    },
    {
      id: 15,
      avatar: 'http://media4.popsugar-assets.com/files/2014/08/08/878/n/1922507' +
      '/caef16ec354ca23b_thumb_temp_cover_file32304521407524949.xxxlarge/i/Funny-Cat-GIFs.jpg',
      fullName: 'Mrowr',
    },
  ],
  isDriver: false,
  isRider: false,
  isMatched: false,
  isConfirmed: false,
  match: null,
  displaySettings: false,
  displayMatchInfo: false,
};

const store = createStore(rootReducer, fromJS(dummyState));

// ReactDOM.render(
//   <Provider store={store}>
//     <ProfileContainer />
//   </Provider>,
//   document.getElementById('app')
// );

const routes = <Route component={Root}>
  <Route path="/profile" component={ProfileContainer} />
  <Route path="/" component={TopNavBarContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={}
  </Provider>,
  document.getElementById('app')
);
