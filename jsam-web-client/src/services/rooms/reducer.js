import { SET_ROOMS, UPDATE_ROOM_BY_ID, DELETE_ROOM_BY_ID } from './actionTypes';

const initialState = [];

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOMS: {
      return [...action.payload];
    }
    case UPDATE_ROOM_BY_ID: {
      let rooms = [...state];
      const roomIndex = rooms.findIndex(room => room._id === action.payload._id);
      rooms[roomIndex] = { ...rooms[roomIndex], ...action.payload.roomUpdateData };

      return rooms;
    }
    case DELETE_ROOM_BY_ID: {
      let rooms = [...state];
      rooms = rooms.filter(room => room._id !== action.payload._id);
      return rooms;
    }
    default:
      return state;
  }
}
export default roomReducer;