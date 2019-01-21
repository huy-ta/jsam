import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_STUDENTS, UPDATE_STUDENT_BY_ID, DELETE_STUDENT_BY_ID, BULK_DELETE_STUDENTS_BY_IDS } from './actionTypes';

// #FIXME: Should I use object as a parameter for Redux actions?

const setStudents = students => ({
  type: SET_STUDENTS,
  payload: students
});

const fetchStudentsToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/students');
    const { students } = response.data.details;
    dispatch(setStudents(students));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateStudentById = (_id, studentUpdateData) => ({
  type: UPDATE_STUDENT_BY_ID,
  payload: {
    _id,
    studentUpdateData
  }
});

const updateStudentOnServerById = (_id, studentUpdateData) => async dispatch => {
  try {
    let depopulatedStudentUpdateData = { ...studentUpdateData };
    depopulatedStudentUpdateData.status = depopulatedStudentUpdateData.status._id;
    await axios.put(`/api/students/${_id}`, depopulatedStudentUpdateData);
    dispatch(updateStudentById(_id, studentUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating student failed.');
  }
};

const deleteStudentById = _id => ({
  type: DELETE_STUDENT_BY_ID,
  payload: { _id }
});

const deleteStudentOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/students/${_id}`);
    dispatch(deleteStudentById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting student failed.');
  }
};

const bulkDeleteStudentsByIds = _ids => ({
  type: BULK_DELETE_STUDENTS_BY_IDS,
  payload: { _ids }
});

const bulkDeleteStudentsOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/students?${reqQuery}`);
    dispatch(bulkDeleteStudentsByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting students failed.');
  }
};

export {
  setStudents,
  fetchStudentsToReduxStore,
  updateStudentById,
  updateStudentOnServerById,
  deleteStudentById,
  deleteStudentOnServerById,
  bulkDeleteStudentsByIds,
  bulkDeleteStudentsOnServerByIds
};

export default setStudents;
