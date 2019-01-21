import {
  SET_ROLES,
  UPDATE_ROLE_BY_ID,
  DELETE_ROLE_BY_ID,
  BULK_DELETE_ROLES_BY_IDS
} from "./actionTypes";

const initialState = [];

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROLES:
      return [...action.payload];
    case UPDATE_ROLE_BY_ID: {
      let roles = [...state];
      const roleIndex = roles.findIndex(
        role => role._id === action.payload._id
      );
      roles[roleIndex] = {
        ...roles[roleIndex],
        ...action.payload.roleUpdateData
      };
      return roles;
    }
    case DELETE_ROLE_BY_ID: {
      let roles = [...state];
      roles = roles.filter(role => role._id !== action.payload._id);
      return roles;
    }
    case BULK_DELETE_ROLES_BY_IDS: {
      let roles = [...state];
      roles = roles.filter(role => !action.payload._ids.includes(role._id));
      return roles;
    }
    default:
      return state;
  }
};

export default roleReducer;
