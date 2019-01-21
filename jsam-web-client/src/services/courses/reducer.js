import { SET_COURSES, UPDATE_COURSE_BY_ID, DELETE_COURSE_BY_ID } from './actionTypes';

const initialState = [];

const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COURSES: {
      return [...action.payload];
    }
    case UPDATE_COURSE_BY_ID: {
      let courses = [...state];
      const courseIndex = courses.findIndex(course => course._id === action.payload._id);
      courses[courseIndex] = { ...courses[courseIndex], ...action.payload.courseUpdateData };

      return courses;
    }
    case DELETE_COURSE_BY_ID: {
      let courses = [...state];
      courses = courses.filter(course => course._id !== action.payload._id);
      return courses;
    }
    default:
      return state;
  }
}
export default courseReducer;