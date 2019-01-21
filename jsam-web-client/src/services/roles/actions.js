import axios from 'axios';

import { openSnackbar } from 'GlobalComponents/Notification';

import { setErrors } from '../error-handler/actions';
import { SET_ROLES, UPDATE_ROLE_BY_ID, DELETE_ROLE_BY_ID, BULK_DELETE_ROLES_BY_IDS } from './actionTypes';

// #FIXME: Should I use object as a parameter for Redux actions?

const setRoles = roles => ({
  type: SET_ROLES,
  payload: roles
});

const fetchRolesToReduxStore = () => async dispatch => {
  try {
    const response = await axios.get('/api/roles');
    const { roles } = response.data.details;
    dispatch(setRoles(roles));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
  }
};

const updateRoleById = (_id, roleUpdateData) => ({
  type: UPDATE_ROLE_BY_ID,
  payload: {
    _id,
    roleUpdateData
  }
});

const updateRoleOnServerById = (_id, roleUpdateData) => async dispatch => {
  try {
    await axios.put(`/api/roles/${_id}`, roleUpdateData);
    dispatch(updateRoleById(_id, roleUpdateData));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Updating role failed.');
  }
};

const deleteRoleById = _id => ({
  type: DELETE_ROLE_BY_ID,
  payload: { _id }
});

const deleteRoleOnServerById = _id => async dispatch => {
  try {
    await axios.delete(`/api/roles/${_id}`);
    dispatch(deleteRoleById(_id));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting role failed.');
  }
};

const bulkDeleteRolesByIds = _ids => ({
  type: BULK_DELETE_ROLES_BY_IDS,
  payload: { _ids }
});

const bulkDeleteRolesOnServerByIds = _ids => async dispatch => {
  try {
    let reqQuery = '';
    _ids.forEach(_id => {
      reqQuery += `_id=${_id}&`;
    });
    reqQuery = reqQuery.substr(0, reqQuery.length - 1);
    await axios.delete(`/api/roles?${reqQuery}`);
    dispatch(bulkDeleteRolesByIds(_ids));
  } catch (err) {
    const { response } = err;
    if (response.status === 504) {
      openSnackbar("The server isn't responding at the moment. Please try again later.");
    } else {
      dispatch(setErrors(err.response));
    }
    throw new Error('Deleting roles failed.');
  }
};

export {
  setRoles,
  fetchRolesToReduxStore,
  updateRoleById,
  updateRoleOnServerById,
  deleteRoleById,
  deleteRoleOnServerById,
  bulkDeleteRolesByIds,
  bulkDeleteRolesOnServerByIds
};

export default setRoles;
