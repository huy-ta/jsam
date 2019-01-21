import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import {
  SET_REGISTRATION_CODES,
  DELETE_REGISTRATION_CODE_BY_ID,
  BULK_DELETE_REGISTRATION_CODES_BY_IDS
} from './actionTypes';

const setRegistrationCodes = registrationCodes => ({
  type: SET_REGISTRATION_CODES,
  payload: registrationCodes
});

const fetchRegistrationCodesToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/registration-codes');
    const { registrationCodes } = response.data.details;
    dispatch(setRegistrationCodes(registrationCodes));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const deleteRegistrationCodeById = _id => ({
  type: DELETE_REGISTRATION_CODE_BY_ID,
  payload: { _id }
});

const deleteRegistrationCodeOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/registration-codes/${_id}`);
    dispatch(deleteRegistrationCodeById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting registrationCode failed.');
  }
};

const bulkDeleteRegistrationCodesByIds = _ids => ({
  type: BULK_DELETE_REGISTRATION_CODES_BY_IDS,
  payload: { _ids }
});

const bulkDeleteRegistrationCodesOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/registration-codes?${reqQuery}`);
    dispatch(bulkDeleteRegistrationCodesByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting registrationCodes failed.');
  }
};

export {
  setRegistrationCodes,
  fetchRegistrationCodesToReduxStore,
  deleteRegistrationCodeById,
  deleteRegistrationCodeOnServerById,
  bulkDeleteRegistrationCodesByIds,
  bulkDeleteRegistrationCodesOnServerByIds
};

export default setRegistrationCodes;
