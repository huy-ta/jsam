import { SET_CLASSES, UPDATE_CLASS_BY_ID, ADD_STUDY_PHASE_TO_CLASS } from './actionTypes';

const initialState = [];

const studentClassReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLASSES:
      return [...action.payload];
    case UPDATE_CLASS_BY_ID: {
      let studentClasses = [...state];
      const studentClassIndex = studentClasses.findIndex(studentClass => studentClass._id === action.payload._id);
      studentClasses[studentClassIndex] = {
        ...studentClasses[studentClassIndex],
        ...action.payload.studentClassUpdateData
      };
      return studentClasses;
    }
    case ADD_STUDY_PHASE_TO_CLASS: {
      let studentClasses = [...state];
      const studentClassIndex = studentClasses.findIndex(studentClass => studentClass._id === action.payload._id);
      studentClasses[studentClassIndex] = action.payload.newClass;
      return studentClasses;
    }
    default:
      return state;
  }
};

export default studentClassReducer;
