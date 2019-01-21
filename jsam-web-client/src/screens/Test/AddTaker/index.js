import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import AddTakerForm from './components/AddTakerForm';
// import FindTaker from '../FindTaker';

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
const AddTaker = props => {
  const { classes, idTest } = props;

  return (
    <Section header="Takers" subheader="Add Taker">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Taker</Typography>
        <AddTakerForm idTest={idTest} />
        {/* <FindTaker /> */}
      </Paper>
    </Section>
  );
};

AddTaker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  // students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  idTest: PropTypes.string.isRequired
};

export default withStyles(styles)(AddTaker);
