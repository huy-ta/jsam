import axios from 'axios';

import { setErrors } from '../error-handler/actions';
import { SET_CURRENT_USER } from './actionTypes';
import {
  setUpAuthTokenAfterLogin,
  removeAuthTokenFromLocalStorage,
  deleteAuthTokenFromAxiosHeaders,
  decodeAuthToken
} from './helpers/authTokenHelper';

const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

const loginUser = userData => async dispatch => {
  try {
    const response = await axios.post('/api/auth/login', userData, {
      timeout: 10000
    });

    const { authToken } = response.data.details;
    setUpAuthTokenAfterLogin(authToken);

    const decoded = decodeAuthToken(authToken);
    dispatch(setCurrentUser(decoded));
  } catch (error) {
    dispatch(setErrors(error.response));
  }
};

const logoutUser = () => dispatch => {
  removeAuthTokenFromLocalStorage();
  deleteAuthTokenFromAxiosHeaders();
  dispatch(setCurrentUser({}));
};

const registerUser = userData => async dispatch => {
  try {
    await axios.post('api/auth/register', userData, {
      timeout: 10000
    });
    const userLogin = {
      email: userData.email,
      password: userData.password
    }
    dispatch(loginUser(userLogin));
  } catch (error) {
    console.log(error);
    dispatch(setErrors(error.response))
  }
}

export { loginUser, setCurrentUser, logoutUser, registerUser };
