import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import AddRegistrationCodeForm from './components/AddRegistrationCodeForm';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  }
});

const AddRegistrationCode = props => {
  const { classes } = props;
  return (
    <Section header="Registration Codes" subheader="Add Registration Code">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Registration Code</Typography>
        <AddRegistrationCodeForm />
      </Paper>
    </Section>
  );
};

AddRegistrationCode.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddRegistrationCode);
