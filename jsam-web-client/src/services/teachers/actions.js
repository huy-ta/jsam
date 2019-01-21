import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_TEACHERS, UPDATE_TEACHER_BY_ID, DELETE_TEACHER_BY_ID } from './actionTypes';

const setTeachers = teachers => ({
  type: SET_TEACHERS,
  payload: teachers
});

const fetchTeachersToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/teachers');
    const { teachers } = response.data.details;

    dispatch(setTeachers(teachers));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateTeacherById = (_id, teacherUpdateData) => ({
  type: UPDATE_TEACHER_BY_ID,
  payload: {
    _id,
    teacherUpdateData
  }
});

const updateTeacherOnServerById = (_id, teacherUpdateData) => async dispatch => {
  try {
    let { name, email, facebook, dateOfBirth, phone, gender, speciality } = teacherUpdateData;
    let teacherUpdateDataOnServer = {};
    if (speciality !== undefined) {
      teacherUpdateDataOnServer = {
        name,
        email,
        facebook,
        dateOfBirth,
        phone,
        gender,
        speciality: speciality._id
      };
    } else {
      teacherUpdateDataOnServer = {
        name,
        email,
        facebook,
        dateOfBirth,
        phone,
        gender
      };
    }

    if (speciality === undefined) speciality = '';
    await axios.put(`/api/teachers/${_id}`, teacherUpdateDataOnServer);
    dispatch(updateTeacherById(_id, teacherUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating teacher failed.');
  }
};

const deleteTeacherById = _id => ({
  type: DELETE_TEACHER_BY_ID,
  payload: { _id }
});

const deleteTeacherOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/teachers/${_id}`);
    dispatch(deleteTeacherById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting teacher failed.');
  }
};

export {
  setTeachers,
  fetchTeachersToReduxStore,
  updateTeacherById,
  updateTeacherOnServerById,
  deleteTeacherById,
  deleteTeacherOnServerById
};

export default setTeachers;
