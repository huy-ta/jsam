import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchStatusToReduxStore } from 'Services/status/actions';

import StatusTable from './components/StatusTable';

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
class FindStatus extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const { dispatchFetchStatusToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchStatusToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = status => {
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
    const fuse = new Fuse(status, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, status } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredStatusList = status;
    if (searchInput.length > 1) {
      filteredStatusList = this.fuse(status);
    }

    return (
      <Section header="Status" subheader="Find Status">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Status</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <StatusTable status={filteredStatusList} isLoading={isLoading} />
      </Section>
    );
  }
}

FindStatus.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  status: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchStatusToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ status }) => ({ status });

const mapDispatchToProps = dispatch => ({
  dispatchFetchStatusToReduxStore: () => dispatch(fetchStatusToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindStatus));
