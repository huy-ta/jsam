import {
  SET_SESSION,
  UPDATE_SESSION_BY_ID,
  DELETE_SESSION_BY_ID,
  BULK_DELETE_SESSION_BY_IDS
} from './actionTypes';

const initialState = [];

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return [...action.payload];
    case UPDATE_SESSION_BY_ID: {
      let sessionList = [...state];
      const sessionIndex = sessionList.findIndex(
        session => session._id === action.payload._id
      );
      sessionList[sessionIndex] = {
        ...sessionList[sessionIndex],
        ...action.payload.sessionUpdateData
      };
      return sessionList;
    }
    case DELETE_SESSION_BY_ID: {
      let sessionList = [...state];
      sessionList = sessionList.filter(
        session => session._id !== action.payload._id
      );
      return sessionList;
    }
    case BULK_DELETE_SESSION_BY_IDS: {
      let sessionList = [...state];
      sessionList = sessionList.filter(
        session => !action.payload._ids.includes(session._id)
      );
      return sessionList;
    }
    case UPDATE_SUMMARY_BY_ID: {
      console.log([...state]);
    }
    default:
      return state;
  }
};

export default sessionReducer;
