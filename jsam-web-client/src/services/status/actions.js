import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_STATUS, UPDATE_STATUS_BY_ID, DELETE_STATUS_BY_ID, BULK_DELETE_STATUS_BY_IDS } from './actionTypes';

// #FIXME: Should I use object as a parameter for Redux actions?

const setStatus = status => ({
  type: SET_STATUS,
  payload: status
});

const fetchStatusToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/status');
    const { status } = response.data.details;
    dispatch(setStatus(status));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateStatusById = (_id, statusUpdateData) => ({
  type: UPDATE_STATUS_BY_ID,
  payload: {
    _id,
    statusUpdateData
  }
});

const updateStatusOnServerById = (_id, statusUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/status/${_id}`, statusUpdateData);
    dispatch(updateStatusById(_id, statusUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating status failed.');
  }
};

const deleteStatusById = _id => ({
  type: DELETE_STATUS_BY_ID,
  payload: { _id }
});

const deleteStatusOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/status/${_id}`);
    dispatch(deleteStatusById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting status failed.');
  }
};

const bulkDeleteStatusByIds = _ids => ({
  type: BULK_DELETE_STATUS_BY_IDS,
  payload: { _ids }
});

const bulkDeleteStatusOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/status?${reqQuery}`);
    dispatch(bulkDeleteStatusByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting status failed.');
  }
};

export {
  setStatus,
  fetchStatusToReduxStore,
  updateStatusById,
  updateStatusOnServerById,
  deleteStatusById,
  deleteStatusOnServerById,
  bulkDeleteStatusByIds,
  bulkDeleteStatusOnServerByIds
};

export default setStatus;
