import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_SESSION, UPDATE_SESSION_BY_ID, DELETE_SESSION_BY_ID, BULK_DELETE_SESSION_BY_IDS } from './actionTypes';

// #FIXME: Should I use object as a parameter for Redux actions?

const setSession = session => ({
  type: SET_SESSION,
  payload: session
});

const fetchSessionToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/session');
    const { session } = response.data.details;
    dispatch(setSession(session));
  } catch (err) {
    const { response } = err;
    if (response.session === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateSessionById = (_id, sessionUpdateData) => ({
  type: UPDATE_SESSION_BY_ID,
  payload: {
    _id,
    sessionUpdateData
  }
});

const updateSessionSummaryOnServerById = (_id, summaryUpdateData) => async dispatch => {
  try {
    await axios.post(`/api/study-sessions/${_id}/summary`, summaryUpdateData);
    dispatch(updateSessionById(_id, summaryUpdateData));
    openSnackbar('Successfully added summary');
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      openSnackbar('Something wrong');
    }
  }
};

const updateSessionOnServerById = (_id, sessionUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/study-sessions/${_id}`, sessionUpdateData);
    dispatch(updateSessionById(_id, sessionUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.session === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating session failed.');
  }
};

const deleteSessionById = _id => ({
  type: DELETE_SESSION_BY_ID,
  payload: { _id }
});

const deleteSessionOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/study-sessions/${_id}`);
    dispatch(deleteSessionById(_id));
  } catch (err) {
    const { response } = err;
    if (response.session === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting session failed.');
  }
};

const bulkDeleteSessionByIds = _ids => ({
  type: BULK_DELETE_SESSION_BY_IDS,
  payload: { _ids }
});

const bulkDeleteSessionOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/study-sessions?${reqQuery}`);
    dispatch(bulkDeleteSessionByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.session === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting session failed.');
  }
};

export {
  setSession,
  fetchSessionToReduxStore,
  updateSessionById,
  updateSessionOnServerById,
  deleteSessionById,
  deleteSessionOnServerById,
  bulkDeleteSessionByIds,
  bulkDeleteSessionOnServerByIds,
  updateSessionSummaryOnServerById
};

export default setSession;
