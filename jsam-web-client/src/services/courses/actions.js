import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_COURSES, UPDATE_COURSE_BY_ID, DELETE_COURSE_BY_ID } from './actionTypes';

const setCourses = courses => ({
  type: SET_COURSES,
  payload: courses
});

const fetchCoursesToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/courses');
    const { courses } = response.data.details;

    dispatch(setCourses(courses));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateCourseById = (_id, courseUpdateData) => ({
  type: UPDATE_COURSE_BY_ID,
  payload: {
    _id,
    courseUpdateData
  }
});

const updateCourseOnServerById = (_id, courseUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/courses/${_id}`, courseUpdateData);

    dispatch(updateCourseById(_id, courseUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating course failed.');
  }
};

const deleteCourseById = _id => ({
  type: DELETE_COURSE_BY_ID,
  payload: { _id }
});

const deleteCourseOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/courses/${_id}`);
    dispatch(deleteCourseById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting course failed.');
  }
};

export {
  setCourses,
  fetchCoursesToReduxStore,
  updateCourseById,
  updateCourseOnServerById,
  deleteCourseById,
  deleteCourseOnServerById
};

export default setCourses;
