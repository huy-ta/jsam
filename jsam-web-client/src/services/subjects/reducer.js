import { SET_SUBJECTS, UPDATE_SUBJECT_BY_ID, DELETE_SUBJECT_BY_ID } from './actionTypes';

const initialState = [];

const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUBJECTS: {
      return [...action.payload];
    }
    case UPDATE_SUBJECT_BY_ID: {
      let subjects = [...state];
      const subjectIndex = subjects.findIndex(subject => subject._id === action.payload._id);
      subjects[subjectIndex] = { ...subjects[subjectIndex], ...action.payload.subjectUpdateData };

      return subjects;
    }
    case DELETE_SUBJECT_BY_ID: {
      let subjects = [...state];
      subjects = subjects.filter(subject => subject._id !== action.payload._id);
      return subjects;
    }
    default:
      return state;
  }
}
export default subjectReducer;