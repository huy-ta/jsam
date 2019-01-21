import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchStudentsToReduxStore } from 'Services/students/actions';

import StudentTable from './components/StudentTable';

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
class FindStudent extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const { dispatchFetchStudentsToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchStudentsToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = students => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'code', 'gender', 'school', 'phone.self', 'phone.parent']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(students, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, students } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredStudentList = students;
    if (searchInput.length > 1) {
      filteredStudentList = this.fuse(students);
    }

    return (
      <Section header="Students" subheader="Find Student">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Student</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <StudentTable students={filteredStudentList} isLoading={isLoading} />
      </Section>
    );
  }
}

FindStudent.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchStudentsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ students }) => ({ students });

const mapDispatchToProps = dispatch => ({
  dispatchFetchStudentsToReduxStore: () => dispatch(fetchStudentsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindStudent));
