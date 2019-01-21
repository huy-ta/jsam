import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import {
  SET_PHASE,
  UPDATE_PHASE_BY_ID,
  DELETE_PHASE_BY_ID,
  REMOVE_PHASE_TEACHER_BY_ID,
  REMOVE_PHASE_ASSISTANT_BY_ID,
  REMOVE_PHASE_STUDENT_BY_ID
} from './actionTypes';

const setPhase = phase => ({
  type: SET_PHASE,
  payload: phase
});

const fetchPhaseToReduxStore = phaseId => async dispatch => {
  try {
    const response = await axios.get(`/api/study-phases/${phaseId}`);
    const { foundStudyPhase } = response.data.details;
    dispatch(setPhase(foundStudyPhase));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updatePhaseById = (_id, phaseUpdateData) => ({
  type: UPDATE_PHASE_BY_ID,
  payload: {
    _id,
    phaseUpdateData
  }
});

const updatePhaseOnServerById = (_id, phaseUpdateData) => async dispatch => {
  try {
    let depopulatedPhaseUpdateData = { ...phaseUpdateData };
    depopulatedPhaseUpdateData.status = depopulatedPhaseUpdateData.status._id;
    await axios.put(`/api/study-phases/${_id}`, depopulatedPhaseUpdateData);
    dispatch(updatePhaseById(_id, phaseUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating phase failed.');
  }
};

const deletePhaseById = _id => ({
  type: DELETE_PHASE_BY_ID,
  payload: { _id }
});

const deletePhaseOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/study-phases/${_id}`);
    dispatch(deletePhaseById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting phase failed.');
  }
};

const removePhaseTeacherById = teacherId => ({
  type: REMOVE_PHASE_TEACHER_BY_ID,
  payload: { teacherId }
});

const removePhaseTeacherOnServerById = (phaseId, teacherId) => async dispatch => {
  try {
    await axios.delete(`/api/study-phases/${phaseId}/teachers`, { data: { teacherIds: [teacherId] } });
    dispatch(removePhaseTeacherById(teacherId));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Removing phase teacher failed.');
  }
};

const removePhaseTeachingAssistantById = teachingAssistantId => ({
  type: REMOVE_PHASE_ASSISTANT_BY_ID,
  payload: { teachingAssistantId }
});

const removePhaseTeachingAssistantOnServerById = (phaseId, teachingAssistantId) => async dispatch => {
  try {
    await axios.delete(`/api/study-phases/${phaseId}/teaching-assistants`, {
      data: { teachingAssistantIds: [teachingAssistantId] }
    });
    dispatch(removePhaseTeachingAssistantById(teachingAssistantId));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Removing phase assistant failed.');
  }
};

const removePhaseStudentById = studentId => ({
  type: REMOVE_PHASE_STUDENT_BY_ID,
  payload: { studentId }
});

const removePhaseStudentOnServerById = (phaseId, studentId) => async dispatch => {
  try {
    await axios.delete(`/api/study-phases/${phaseId}/students`, {
      data: { studentIds: [studentId] }
    });
    dispatch(removePhaseStudentById(studentId));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Removing phase student failed.');
  }
};

export {
  setPhase as setPhases,
  fetchPhaseToReduxStore,
  updatePhaseById,
  updatePhaseOnServerById,
  deletePhaseById,
  deletePhaseOnServerById,
  removePhaseTeacherById,
  removePhaseTeacherOnServerById,
  removePhaseTeachingAssistantById,
  removePhaseTeachingAssistantOnServerById,
  removePhaseStudentById,
  removePhaseStudentOnServerById
};

export default setPhase;
