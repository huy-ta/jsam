import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchFaultsToReduxStore } from 'Services/faults/actions';

import FaultTable from './components/FaultTable';

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
class FindFault extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const { dispatchFetchFaultsToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchFaultsToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = faults => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'description', 'fine']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(faults, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, faults } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredFaultList = faults;
    if (searchInput.length > 1) {
      filteredFaultList = this.fuse(faults);
    }

    return (
      <Section header="Faults" subheader="Find Fault">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Fault</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <FaultTable faults={filteredFaultList} isLoading={isLoading} />
      </Section>
    );
  }
}

FindFault.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  faults: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchFaultsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ faults }) => ({ faults });

const mapDispatchToProps = dispatch => ({
  dispatchFetchFaultsToReduxStore: () => dispatch(fetchFaultsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindFault));
