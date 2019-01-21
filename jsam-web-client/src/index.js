import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import './styles.scss';

import App from './App';
import { history } from './config/routers/AppRouter';
import configureStore from './config/store/configureStore';
import {
  getAuthTokenFromLocalStorage,
  setAuthTokenToAxiosHeaders,
  decodeAuthToken,
  removeAuthTokenFromLocalStorage
} from './services/authentication/helpers/authTokenHelper';
import { logoutUser, setCurrentUser } from './services/authentication/actions';

const store = configureStore();

const jwtToken = getAuthTokenFromLocalStorage();
if (jwtToken) {
  const decoded = decodeAuthToken(jwtToken);

  // Check for expired token
  // The expiry time in jwtToken is calculated in seconds
  const currentTime = moment() / 1000;
  if (decoded.exp < currentTime) {
    removeAuthTokenFromLocalStorage();
    store.dispatch(logoutUser());
    history.push('/');
  } else {
    setAuthTokenToAxiosHeaders(jwtToken);
    store.dispatch(setCurrentUser(decoded));
  }
}

const appRoot = document.getElementById('app');
ReactDOM.render(<App store={store} />, appRoot);
