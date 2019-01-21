import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import AddStatusForm from './components/AddStatusForm';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  }
});

const AddStatus = props => {
  const { classes } = props;
  return (
    <Section header="Status" subheader="Add Status">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Status</Typography>
        <AddStatusForm />
      </Paper>
    </Section>
  );
};

AddStatus.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddStatus);
