import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  progress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 3
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  }
});

const PaperLoading = props => {
  const { classes } = props;

  return (
    <React.Fragment>
      <div className={classes.overlay} />
      <LinearProgress className={classes.progress} color="secondary" />
    </React.Fragment>
  );
};

PaperLoading.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(PaperLoading);
