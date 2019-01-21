import {
  SET_STUDENTS,
  UPDATE_STUDENT_BY_ID,
  DELETE_STUDENT_BY_ID,
  BULK_DELETE_STUDENTS_BY_IDS
} from './actionTypes';

const initialState = [];

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STUDENTS:
      return [...action.payload];
    case UPDATE_STUDENT_BY_ID: {
      let students = [...state];
      const studentIndex = students.findIndex(
        student => student._id === action.payload._id
      );
      students[studentIndex] = {
        ...students[studentIndex],
        ...action.payload.studentUpdateData
      };
      return students;
    }
    case DELETE_STUDENT_BY_ID: {
      let students = [...state];
      students = students.filter(student => student._id !== action.payload._id);
      return students;
    }
    case BULK_DELETE_STUDENTS_BY_IDS: {
      let students = [...state];
      students = students.filter(
        student => !action.payload._ids.includes(student._id)
      );
      return students;
    }
    default:
      return state;
  }
};

export default studentReducer;
