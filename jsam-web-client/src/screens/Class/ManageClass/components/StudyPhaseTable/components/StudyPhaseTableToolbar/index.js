import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  spacer: {
    flex: '1 1 100%'
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
        <div className={classes.spacer} />
      </Toolbar>
    );
  }
}

ClassTableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(ClassTableToolbar);
