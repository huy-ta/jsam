import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Notification from 'GlobalComponents/Notification';

import AppRouter from './config/routers/AppRouter';
import useTheme from './hooks/useTheme';

const App = ({ store }) => {
  const theme = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CssBaseline />
        <Provider store={store}>
          <AppRouter />
        </Provider>
        <Notification />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

App.propTypes = {
  store: PropTypes.shape({}).isRequired
};

export default App;
