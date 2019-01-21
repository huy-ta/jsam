import React from 'react';
import PropTypes from 'prop-types';

import Sign from 'Shells/Sign';
import RegisterForm from './components/RegisterForm';

const Register = props => {
  const { history } = props;
  return (
    <Sign>
      <RegisterForm history={history} />
    </Sign>
  );
};

Register.propTypes = {
  history: PropTypes.shape({}).isRequired
};

export { Register };

export default Register;
