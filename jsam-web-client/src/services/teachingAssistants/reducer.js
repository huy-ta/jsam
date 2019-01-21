import { SET_TEACHING_ASSISTANTS, UPDATE_TEACHING_ASSISTANTS_BY_ID, DELETE_TEACHING_ASSISTANTS_BY_ID, BULK_DELETE_TEACHING_ASSISTANTS_BY_IDS } from './actionTypes';

const initialState = [];

const teachingAssistantReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEACHING_ASSISTANTS:
      return [...action.payload];
    case UPDATE_TEACHING_ASSISTANTS_BY_ID: {
      let teachingAssistants = [...state];
      const teachingAssistantIndex = teachingAssistants.findIndex(teachingAssistant => teachingAssistant._id === action.payload._id);
      teachingAssistants[teachingAssistantIndex] = { ...teachingAssistants[teachingAssistantIndex], ...action.payload.teachingAssistantUpdateData };
      return teachingAssistants;
    }
    case DELETE_TEACHING_ASSISTANTS_BY_ID: {
      let teachingAssistants = [...state];
      teachingAssistants = teachingAssistants.filter(teachingAssistant => teachingAssistant._id !== action.payload._id);
      return teachingAssistants;
    }
    case BULK_DELETE_TEACHING_ASSISTANTS_BY_IDS: {
      let teachingAssistants = [...state];
      teachingAssistants = teachingAssistants.filter(teachingAssistant => !action.payload._ids.includes(teachingAssistant._id));
      return teachingAssistants;
    }
    default:
      return state;
  }
};

export default teachingAssistantReducer;
