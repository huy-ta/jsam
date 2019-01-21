import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  spacer: {
    flex: '1 1 100%'
  },
  title: {
    flex: '0 0 auto'
  }
});

const SimpleTableToolbar = props => {
  const { classes, tableTitle } = props;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h6">{tableTitle}</Typography>
      </div>
      <div className={classes.spacer} />
    </Toolbar>
  );
};

SimpleTableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  tableTitle: PropTypes.string.isRequired
};

export default withStyles(styles)(SimpleTableToolbar);
