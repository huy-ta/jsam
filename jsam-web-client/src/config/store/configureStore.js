import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import authReducer from 'Services/authentication/reducer';

// import stylesReducer from '../styles/reducer';
import errorReducer from 'Services/error-handler/reducer';
import roleReducer from 'Services/roles/reducer';
import registrationCodeReducer from 'Services/registration-codes/reducer';
import faultReducer from 'Services/faults/reducer';
import statusReducer from 'Services/status/reducer';
import studentReducer from 'Services/students/reducer';
import teacherReducer from 'Services/teachers/reducer';
import subjectReducer from 'Services/subjects/reducer';
import teachingAssistantReducer from 'Services/teachingAssistants/reducer';
import roomReducer from 'Services/rooms/reducer';
import studentClassReducer from 'Services/classes/reducer';
import testReducer from 'Services/tests/reducer';
import phaseReducer from 'Services/phases/reducer';
import courseReducer from 'Services/courses/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      errors: errorReducer,
      // styles: stylesReducer,
      roles: roleReducer,
      status: statusReducer,
      teachers: teacherReducer,
      subjects: subjectReducer,
      students: studentReducer,
      teachingAssistants: teachingAssistantReducer,
      rooms: roomReducer,
      classes: studentClassReducer,
      registrationCodes: registrationCodeReducer,
      faults: faultReducer,
      tests: testReducer,
      phase: phaseReducer,
      courses: courseReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};

export default configureStore;
