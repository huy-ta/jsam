import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import AddTeachingAssistantForm from './components/AddTeachingAssistantForm';

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
const AddTeachingAssistant = props => {
  const { classes } = props;
  return (
    <Section header="Teaching Assistants" subheader="Add Teaching Assistant">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Teaching Assistant</Typography>
        <AddTeachingAssistantForm />
      </Paper>
    </Section>
  );
};

AddTeachingAssistant.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddTeachingAssistant);
