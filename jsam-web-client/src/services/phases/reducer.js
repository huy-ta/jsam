import {
  SET_PHASE,
  UPDATE_PHASE_BY_ID,
  REMOVE_PHASE_TEACHER_BY_ID,
  REMOVE_PHASE_ASSISTANT_BY_ID,
  REMOVE_PHASE_STUDENT_BY_ID
} from './actionTypes';

const initialState = {};

const phaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PHASE:
      return action.payload;
    case UPDATE_PHASE_BY_ID: {
      return { ...state, ...action.payload.phaseUpdateData };
    }
    case REMOVE_PHASE_TEACHER_BY_ID: {
      let phase = { ...state };
      phase.teachers = phase.teachers.filter(teacher => teacher.teacherId !== action.payload.teacherId);
      return phase;
    }
    case REMOVE_PHASE_ASSISTANT_BY_ID: {
      let phase = { ...state };
      phase.teachingAssistants = phase.teachingAssistants.filter(
        teachingAssistant => teachingAssistant.teachingAssistantId !== action.payload.teachingAssistantId
      );
      return phase;
    }
    case REMOVE_PHASE_STUDENT_BY_ID: {
      let phase = { ...state };
      phase.students = phase.students.filter(student => student.studentId !== action.payload.studentId);
      return phase;
    }
    default:
      return state;
  }
};

export default phaseReducer;
