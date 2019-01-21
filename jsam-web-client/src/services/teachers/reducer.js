import { SET_TEACHERS, UPDATE_TEACHER_BY_ID, DELETE_TEACHER_BY_ID } from './actionTypes';

const initialState = [];

const teacherReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEACHERS: {
      return [...action.payload];
    }
    case UPDATE_TEACHER_BY_ID: {
      let teachers = [...state];
      const teacherIndex = teachers.findIndex(teacher => teacher._id === action.payload._id);
      teachers[teacherIndex] = { ...action.payload.teacherUpdateData };
      return teachers;
    }
    case DELETE_TEACHER_BY_ID: {
      let teachers = [...state];
      teachers = teachers.filter(teacher => teacher._id !== action.payload._id);
      return teachers;
    }
    default:
      return state;
  }
};
export default teacherReducer;
