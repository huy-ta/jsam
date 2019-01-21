import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import {
  SET_TEACHING_ASSISTANTS,
  UPDATE_TEACHING_ASSISTANTS_BY_ID,
  DELETE_TEACHING_ASSISTANTS_BY_ID,
  BULK_DELETE_TEACHING_ASSISTANTS_BY_IDS
} from './actionTypes';

// #FIXME: Should I use object as a parameter for Redux actions?

const setTeachingAssistants = teachingAssistants => ({
  type: SET_TEACHING_ASSISTANTS,
  payload: teachingAssistants
});

const fetchTeachingAssistantsToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/teaching-assistants');
    const { teachingAssistants } = response.data.details;
    dispatch(setTeachingAssistants(teachingAssistants));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateTeachingAssistantById = (_id, teachingAssistantsUpdateData) => ({
  type: UPDATE_TEACHING_ASSISTANTS_BY_ID,
  payload: {
    _id,
    teachingAssistantsUpdateData
  }
});

const updateTeachingAssistantOnServerById = (_id, teachingAssistantsUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/teaching-assistants/${_id}`, teachingAssistantsUpdateData);
    dispatch(updateTeachingAssistantById(_id, teachingAssistantsUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating teaching assistant failed.');
  }
};

const deleteTeachingAssistantById = _id => ({
  type: DELETE_TEACHING_ASSISTANTS_BY_ID,
  payload: { _id }
});

const deleteTeachingAssistantOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/teaching-assistants/${_id}`);
    dispatch(deleteTeachingAssistantById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting teaching assistant failed.');
  }
};

const bulkDeleteTeachingAssistantsByIds = _ids => ({
  type: BULK_DELETE_TEACHING_ASSISTANTS_BY_IDS,
  payload: { _ids }
});

const bulkDeleteTeachingAssistantsOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/teaching-assistants?${reqQuery}`);
    dispatch(bulkDeleteTeachingAssistantsByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting teaching assistants failed.');
  }
};

export {
  setTeachingAssistants,
  fetchTeachingAssistantsToReduxStore,
  updateTeachingAssistantById,
  updateTeachingAssistantOnServerById,
  deleteTeachingAssistantById,
  deleteTeachingAssistantOnServerById,
  bulkDeleteTeachingAssistantsByIds,
  bulkDeleteTeachingAssistantsOnServerByIds
};

export default setTeachingAssistants;
