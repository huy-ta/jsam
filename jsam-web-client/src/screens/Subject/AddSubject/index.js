import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import AddSubjectForm from './components/AddSubjectForm';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1
  }
});

// Stateless Component
const AddSubject = props => {
  const { classes } = props;
  return (
    <Section header="Subjects" subheader="Add Subject">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Subject</Typography>
        <AddSubjectForm />
      </Paper>
    </Section>
  );
};

AddSubject.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddSubject);
