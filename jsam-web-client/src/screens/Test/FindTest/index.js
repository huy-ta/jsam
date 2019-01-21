import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchTestsToReduxStore } from 'Services/tests/actions';
import { fetchStudentsToReduxStore } from 'Services/students/actions';

import TestTable from './components/TestTable';

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
class FindTest extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const {
      dispatchFetchTestsToReduxStore,
      dispatchFetchStudentsToReduxStore
    } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchTestsToReduxStore();
    await dispatchFetchStudentsToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = tests => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'totalMarks', 'takers']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(tests, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, tests, students } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredTestList = tests;
    if (searchInput.length > 1) {
      filteredTestList = this.fuse(tests);
    }

    return (
      <Section header="Tests" subheader="Find Test">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Test</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <TestTable
          tests={filteredTestList}
          students={students}
          isLoading={isLoading}
        />
      </Section>
    );
  }
}

FindTest.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  tests: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchTestsToReduxStore: PropTypes.func.isRequired,
  dispatchFetchStudentsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ tests, students }) => ({ tests, students });

const mapDispatchToProps = dispatch => ({
  dispatchFetchTestsToReduxStore: () => dispatch(fetchTestsToReduxStore()),
  dispatchFetchStudentsToReduxStore: () => dispatch(fetchStudentsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindTest));
