import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import AddRoleForm from './components/AddRoleForm';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  }
});

// Stateless Component
const AddRole = props => {
  const { classes } = props;
  return (
    <Section header="Roles" subheader="Add Role">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Role</Typography>
        <AddRoleForm />
      </Paper>
    </Section>
  );
};

AddRole.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddRole);
