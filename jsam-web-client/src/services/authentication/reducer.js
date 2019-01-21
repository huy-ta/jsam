import _ from 'lodash';

import { SET_CURRENT_USER } from './actionTypes';

// FIXME: Find the correct way to import lodash (minimal size)

const initialState = {
  isAuthenticated: false,
  user: {}
};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !_.isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
};

export default authenticationReducer;
