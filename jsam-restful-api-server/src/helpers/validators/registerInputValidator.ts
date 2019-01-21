import _ from 'lodash';
import validator from 'validator';

interface IRegisterInput {
  name: string;
  username: string;
  password: string;
  password2: string;
}

interface IRegisterErrors {
  name?: string;
  username?: string;
  password?: string;
  password2?: string;
}

const validateRegisterInput = (data: IRegisterInput) => {
  let errors: IRegisterErrors = {};

  data.name = !_.isEmpty(data.name) ? data.name : '';
  data.username = !_.isEmpty(data.username) ? data.username : '';
  data.password = !_.isEmpty(data.password) ? data.password : '';
  data.password2 = !_.isEmpty(data.password2) ? data.password2 : '';

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters.';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required.';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Username field is required.';
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required.';
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match.';
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

export { validateRegisterInput };

export default validateRegisterInput;
