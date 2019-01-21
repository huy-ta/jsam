import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchClassesToReduxStore } from 'Services/classes/actions';

import ClassTable from './components/ClassTable';

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
class FindClass extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const { dispatchFetchClassesToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchClassesToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = studentClasses => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'description']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(studentClasses, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, studentClasses } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredClassList = studentClasses;
    if (searchInput.length > 1) {
      filteredClassList = this.fuse(studentClasses);
    }

    return (
      <Section header="Classes" subheader="Find Class">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Class</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <ClassTable studentClasses={filteredClassList} isLoading={isLoading} />
      </Section>
    );
  }
}

FindClass.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  studentClasses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchClassesToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ classes }) => ({ studentClasses: classes });

const mapDispatchToProps = dispatch => ({
  dispatchFetchClassesToReduxStore: () => dispatch(fetchClassesToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindClass));
