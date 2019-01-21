import {
  SET_FAULTS,
  UPDATE_FAULT_BY_ID,
  DELETE_FAULT_BY_ID,
  BULK_DELETE_FAULTS_BY_IDS
} from './actionTypes';

const initialState = [];

const faultReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAULTS:
      return [...action.payload];
    case UPDATE_FAULT_BY_ID: {
      let faults = [...state];
      const faultIndex = faults.findIndex(
        fault => fault._id === action.payload._id
      );
      faults[faultIndex] = {
        ...faults[faultIndex],
        ...action.payload.faultUpdateData
      };
      return faults;
    }
    case DELETE_FAULT_BY_ID: {
      let faults = [...state];
      faults = faults.filter(fault => fault._id !== action.payload._id);
      return faults;
    }
    case BULK_DELETE_FAULTS_BY_IDS: {
      let faults = [...state];
      faults = faults.filter(fault => !action.payload._ids.includes(fault._id));
      return faults;
    }
    default:
      return state;
  }
};

export default faultReducer;
