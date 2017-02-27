/**
    Hello and welcome to Fleet's frontend codebase.

    *See client/lib/storeConfig.js for Redux documentation.

    This is the entry point of our primarily single-paged application and performs
    most high-level configuration of our infrastructure such as initializing communication
    with our server and syncronization of app history with browser history.

    The technologies we use to support our front-end include React, Redux,
    Immutable, and WebSockets.
**/

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { store } from './lib/storeConfig';

import Root from './containers/Root';
import { ProfileContainer } from './containers/Profile';
import { MainContainer } from './containers/Main';
import { FriendList } from './containers/Friends';
import { LoginContainer } from './containers/Login';

import { socket } from './lib/socketConfig';
import { configureListeners } from './lib/socketListeners';
import initLocationWatcher from './lib/locationWatcher';

initLocationWatcher();
configureListeners(socket);

const routes = <Route component={Root}>
  <Route path="/" component={MainContainer} />
  <Route path="/profile" component={ProfileContainer} />
  <Route path="/login" component={LoginContainer} />
  <Route path="/friends" component={FriendList} />
</Route>;

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);

