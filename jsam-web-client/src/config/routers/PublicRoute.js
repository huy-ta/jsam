import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { APP_LINKS } from './appLinks';

export const PublicRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated ? <Redirect to={APP_LINKS.DASHBOARD} /> : <Component {...props} />)}
  />
);

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(PublicRoute);
