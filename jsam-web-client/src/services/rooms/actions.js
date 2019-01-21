import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_ROOMS, UPDATE_ROOM_BY_ID, DELETE_ROOM_BY_ID } from './actionTypes';

const setRooms = rooms => ({
  type: SET_ROOMS,
  payload: rooms
});

const fetchRoomsToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/rooms');
    const { rooms } = response.data.details;

    dispatch(setRooms(rooms));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateRoomById = (_id, roomUpdateData) => ({
  type: UPDATE_ROOM_BY_ID,
  payload: {
    _id,
    roomUpdateData
  }
});

const updateRoomOnServerById = (_id, roomUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/rooms/${_id}`, roomUpdateData);

    dispatch(updateRoomById(_id, roomUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating room failed.');
  }
};

const deleteRoomById = _id => ({
  type: DELETE_ROOM_BY_ID,
  payload: { _id }
});

const deleteRoomOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/rooms/${_id}`);
    dispatch(deleteRoomById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting room failed.');
  }
};

export {
  setRooms,
  fetchRoomsToReduxStore,
  updateRoomById,
  updateRoomOnServerById,
  deleteRoomById,
  deleteRoomOnServerById
};

export default setRooms;
