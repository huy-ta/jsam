import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MainAppBar from 'GlobalComponents/MainAppBar';
import Sidebar from 'GlobalComponents/Sidebar';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default
  }
});

const Layout = props => {
  const { classes, children } = props;

  return (
    <div className={classes.root}>
      <MainAppBar />
      <Sidebar />
      <div className={classes.content}>{children}</div>
    </div>
  );
};

Layout.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(Layout);
