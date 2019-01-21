import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.primary.contrastText
  },
  title: {
    flex: '0 0 auto'
  }
});

const SubjectTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} Subject(s) selected
          </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
              Subject List
          </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" color="inherit">
              <DeleteIcon color="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

SubjectTableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  numSelected: PropTypes.number.isRequired
};

export default withStyles(styles)(SubjectTableToolbar);