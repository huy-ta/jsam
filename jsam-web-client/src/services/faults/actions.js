import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_FAULTS, UPDATE_FAULT_BY_ID, DELETE_FAULT_BY_ID, BULK_DELETE_FAULTS_BY_IDS } from './actionTypes';

// #FIXME: Should I use object as a parameter for Redux actions?

const setFaults = faults => ({
  type: SET_FAULTS,
  payload: faults
});

const fetchFaultsToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/faults');
    const { faults } = response.data.details;
    dispatch(setFaults(faults));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateFaultById = (_id, faultUpdateData) => ({
  type: UPDATE_FAULT_BY_ID,
  payload: {
    _id,
    faultUpdateData
  }
});

const updateFaultOnServerById = (_id, faultUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/faults/${_id}`, faultUpdateData);
    dispatch(updateFaultById(_id, faultUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating fault failed.');
  }
};

const deleteFaultById = _id => ({
  type: DELETE_FAULT_BY_ID,
  payload: { _id }
});

const deleteFaultOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/faults/${_id}`);
    dispatch(deleteFaultById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting fault failed.');
  }
};

const bulkDeleteFaultsByIds = _ids => ({
  type: BULK_DELETE_FAULTS_BY_IDS,
  payload: { _ids }
});

const bulkDeleteFaultsOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/faults?${reqQuery}`);
    dispatch(bulkDeleteFaultsByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting faults failed.');
  }
};

export {
  setFaults,
  fetchFaultsToReduxStore,
  updateFaultById,
  updateFaultOnServerById,
  deleteFaultById,
  deleteFaultOnServerById,
  bulkDeleteFaultsByIds,
  bulkDeleteFaultsOnServerByIds
};

export default setFaults;
