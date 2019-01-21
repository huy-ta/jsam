import {
  SET_TESTS,
  SET_TAKERS,
  UPDATE_TEST_BY_ID,
  UPDATE_TAKER_BY_ID,
  DELETE_TEST_BY_ID,
  DELETE_TAKER_BY_ID,
  BULK_DELETE_TESTS_BY_IDS,
  BULK_DELETE_TAKERS_BY_IDS
} from './actionTypes';

const initialState = [];

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TESTS:
      return [...action.payload];
    case SET_TAKERS: {
      let tests = [...state];
      tests.takers = [...action.payload];
      return tests;
    }
    // return [...action.payload];
    case UPDATE_TEST_BY_ID: {
      let tests = [...state];
      const testIndex = tests.findIndex(
        test => test._id === action.payload._id
      );
      tests[testIndex] = {
        ...tests[testIndex],
        ...action.payload.testUpdateData
      };
      return tests;
    }
    case UPDATE_TAKER_BY_ID: {
      let tests = [...state];
      const takerIndex = tests.takers.findIndex(
        taker => taker.studentId === action.payload._id
      );
      tests.takers[takerIndex] = {
        ...tests.takers[takerIndex],
        ...action.payload.takerUpdateData
      };
      return tests;
    }
    case DELETE_TEST_BY_ID: {
      let tests = [...state];
      tests = tests.filter(test => test._id !== action.payload._id);
      return tests;
    }
    case DELETE_TAKER_BY_ID: {
      let tests = [...state];
      tests.takers = tests.takers.filter(
        taker => taker.studentId !== action.payload._id
      );
      return tests;
    }
    case BULK_DELETE_TESTS_BY_IDS: {
      let tests = [...state];
      tests = tests.filter(test => !action.payload._ids.includes(test._id));
      return tests;
    }
    case BULK_DELETE_TAKERS_BY_IDS: {
      let tests = [...state];
      tests.takers = tests.takers.filter(
        taker => !action.payload._ids.includes(taker.studentId)
      );
      return tests;
    }
    default:
      return state;
  }
};

export default testReducer;
