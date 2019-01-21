import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import { fetchStatusToReduxStore } from 'Services/status/actions';
import AddStudentForm from './components/AddStudentForm';

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
const AddStudent = props => {
  const { classes, status, dispatchFetchStatusToReduxStore } = props;

  useEffect(() => {
    dispatchFetchStatusToReduxStore();
  }, []);

  return (
    <Section header="Students" subheader="Add Student">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Student</Typography>
        <AddStudentForm statusList={status} />
      </Paper>
    </Section>
  );
};

AddStudent.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  status: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchStatusToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ status }) => ({
  status
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchStatusToReduxStore: () => dispatch(fetchStatusToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddStudent));
