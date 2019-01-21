import { SET_STATUS, UPDATE_STATUS_BY_ID, DELETE_STATUS_BY_ID, BULK_DELETE_STATUS_BY_IDS } from './actionTypes';

const initialState = [];

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATUS:
      return [...action.payload];
    case UPDATE_STATUS_BY_ID: {
      let statusList = [...state];
      const statusIndex = statusList.findIndex(status => status._id === action.payload._id);
      statusList[statusIndex] = { ...statusList[statusIndex], ...action.payload.statusUpdateData };
      return statusList;
    }
    case DELETE_STATUS_BY_ID: {
      let statusList = [...state];
      statusList = statusList.filter(status => status._id !== action.payload._id);
      return statusList;
    }
    case BULK_DELETE_STATUS_BY_IDS: {
      let statusList = [...state];
      statusList = statusList.filter(status => !action.payload._ids.includes(status._id));
      return statusList;
    }
    default:
      return state;
  }
};

export default statusReducer;
