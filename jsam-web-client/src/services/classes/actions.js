import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_CLASSES, UPDATE_CLASS_BY_ID, ADD_STUDY_PHASE_TO_CLASS } from './actionTypes';

const setClasses = classes => ({
  type: SET_CLASSES,
  payload: classes
});

const fetchClassesToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/classes');
    const { classes } = response.data.details;
    dispatch(setClasses(classes));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateClassById = (_id, classUpdateData) => ({
  type: UPDATE_CLASS_BY_ID,
  payload: {
    _id,
    classUpdateData
  }
});

const updateClassOnServerById = (_id, classUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/classes/${_id}`, classUpdateData);
    dispatch(updateClassById(_id, classUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating class failed.');
  }
};

const addStudyPhaseToClass = (_id, newClass) => ({
  type: ADD_STUDY_PHASE_TO_CLASS,
  payload: {
    _id,
    newClass
  }
});

const addStudyPhaseToClassOnServer = (_id, studyPhaseInfo) => async dispatch => {
  try {
    const response = await axios.post(`/api/classes/${_id}/study-phases`, studyPhaseInfo);
    const { newClass } = response.data.details;
    dispatch(addStudyPhaseToClass(_id, newClass));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Adding study phase to class failed.');
  }
};

export {
  setClasses,
  fetchClassesToReduxStore,
  updateClassById,
  updateClassOnServerById,
  addStudyPhaseToClass,
  addStudyPhaseToClassOnServer
};

export default setClasses;
