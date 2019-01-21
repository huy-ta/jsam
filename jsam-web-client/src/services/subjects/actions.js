import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_SUBJECTS, UPDATE_SUBJECT_BY_ID, DELETE_SUBJECT_BY_ID } from './actionTypes';

const setSubjects = subjects => ({
  type: SET_SUBJECTS,
  payload: subjects
});

const fetchSubjectsToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/subjects');
    const { subjects } = response.data.details;

    dispatch(setSubjects(subjects));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateSubjectById = (_id, subjectUpdateData) => ({
  type: UPDATE_SUBJECT_BY_ID,
  payload: {
    _id,
    subjectUpdateData
  }
});

const updateSubjectOnServerById = (_id, subjectUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/subjects/${_id}`, subjectUpdateData);

    dispatch(updateSubjectById(_id, subjectUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating subject failed.');
  }
};

const deleteSubjectById = _id => ({
  type: DELETE_SUBJECT_BY_ID,
  payload: { _id }
});

const deleteSubjectOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/subjects/${_id}`);
    dispatch(deleteSubjectById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting subject failed.');
  }
};

export {
  setSubjects,
  fetchSubjectsToReduxStore,
  updateSubjectById,
  updateSubjectOnServerById,
  deleteSubjectById,
  deleteSubjectOnServerById
};

export default setSubjects;
