import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
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

const setTests = tests => ({
  type: SET_TESTS,
  payload: tests
});

const setTakers = takers => ({
  type: SET_TAKERS,
  payload: takers
});

const fetchTestsToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/tests');
    const { tests } = response.data.details;
    dispatch(setTests(tests));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const fetchTakersToReduxStore = _id => async dispatch => {
  try {
    const response = await axios.get(`/api/tests/${_id}`);
    // console.log(response);
    dispatch(setTakers(response.data.details.takers));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateTestById = (_id, testUpdateData) => ({
  type: UPDATE_TEST_BY_ID,
  payload: {
    _id,
    testUpdateData
  }
});

const updateTestOnServerById = (_id, testUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/tests/${_id}`, testUpdateData);
    dispatch(updateTestById(_id, testUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating test failed.');
  }
};

const updateTakerById = (_id, takerUpdateData) => ({
  type: UPDATE_TAKER_BY_ID,
  payload: {
    _id,
    takerUpdateData
  }
});

const updateTakerOnServerById = (
  _idTest,
  _id,
  takerUpdateData
) => async dispatch => {
  try {
    await axios.put(`/api/tests/${_idTest}/takers`, takerUpdateData);
    dispatch(updateTakerById(_id, takerUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating test failed.');
  }
};

const deleteTestById = _id => ({
  type: DELETE_TEST_BY_ID,
  payload: { _id }
});

const deleteTestOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/tests/${_id}`);
    dispatch(deleteTestById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting test failed.');
  }
};

const deleteTakerById = _id => ({
  type: DELETE_TAKER_BY_ID,
  payload: { _id }
});

const deleteTakerOnServerById = (_idTest, _id) => async dispatch => {
  try {
    await axios.delete(`/api/tests/${_idTest}/takers`);
    dispatch(deleteTakerById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting test failed.');
  }
};

const bulkDeleteTestsByIds = _ids => ({
  type: BULK_DELETE_TESTS_BY_IDS,
  payload: { _ids }
});

const bulkDeleteTestsOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/tests?${reqQuery}`);
    dispatch(bulkDeleteTestsByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting tests failed.');
  }
};

const bulkDeleteTakersByIds = _ids => ({
  type: BULK_DELETE_TAKERS_BY_IDS,
  payload: { _ids }
});

const bulkDeleteTakersOnServerByIds = (_idTest, _ids) => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/tests/${_idTest}/takers?${reqQuery}`);
    dispatch(bulkDeleteTestsByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar(
        "The server isn't responding at the moment. Please try again later."
      );
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting tests failed.');
  }
};

export {
  setTests,
  setTakers,
  fetchTestsToReduxStore,
  fetchTakersToReduxStore,
  updateTestById,
  updateTakerById,
  updateTestOnServerById,
  updateTakerOnServerById,
  deleteTestById,
  deleteTakerById,
  deleteTestOnServerById,
  deleteTakerOnServerById,
  bulkDeleteTestsByIds,
  bulkDeleteTakersByIds,
  bulkDeleteTestsOnServerByIds,
  bulkDeleteTakersOnServerByIds
};

export default setTests;
