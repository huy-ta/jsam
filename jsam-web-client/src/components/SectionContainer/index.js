import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 1.2
  }
});

const SectionContainer = props => {
  const { classes, children } = props;

  return <div className={classes.root}>{children}</div>;
};

SectionContainer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired
};

const StyledSectionContainer = withStyles(styles)(SectionContainer);

export default StyledSectionContainer;
