import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { APP_LINKS } from './appLinks';

export const PrivateRoleRoute = ({ auth, component: Component, allowedRoles, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!auth.isAuthenticated) return <Redirect to="/" />;
      if (!allowedRoles.includes(auth.user.role)) return <Redirect to={APP_LINKS.LOOK_UP_MODULE} />;
      return <Component {...props} />;
    }}
  />
);

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps)(PrivateRoleRoute);
