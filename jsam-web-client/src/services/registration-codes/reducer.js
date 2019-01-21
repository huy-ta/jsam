import {
  SET_REGISTRATION_CODES,
  DELETE_REGISTRATION_CODE_BY_ID,
  BULK_DELETE_REGISTRATION_CODES_BY_IDS
} from './actionTypes';

const initialState = [];

const registrationCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REGISTRATION_CODES:
      return [...action.payload];
    case DELETE_REGISTRATION_CODE_BY_ID: {
      let registrationCodes = [...state];
      registrationCodes = registrationCodes.filter(registrationCode => registrationCode._id !== action.payload._id);
      return registrationCodes;
    }
    case BULK_DELETE_REGISTRATION_CODES_BY_IDS: {
      let registrationCodes = [...state];
      registrationCodes = registrationCodes.filter(
        registrationCode => !action.payload._ids.includes(registrationCode._id)
      );
      return registrationCodes;
    }
    default:
      return state;
  }
};

export default registrationCodeReducer;
