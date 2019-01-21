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

class ClassTableToolbar extends React.Component {
  state = {};

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { classes } = this.props;

    return (
      <Toolbar className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h6" id="tableTitle">
            Class List
          </Typography>
        </div>
        <div className={classes.spacer} />
      </Toolbar>
    );
  }
}

ClassTableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(ClassTableToolbar);
