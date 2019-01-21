import { GET_ERRORS } from './actionTypes';

const setErrors = errors => ({
  type: GET_ERRORS,
  payload: errors
});

export { setErrors };

export default setErrors;
