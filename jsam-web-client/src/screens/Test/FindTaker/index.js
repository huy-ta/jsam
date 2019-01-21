import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchTakersToReduxStore } from 'Services/tests/actions';

import TakerTable from './components/TakerTable';

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
class FindTaker extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const { idTest } = this.props;
    const { dispatchFetchTakersToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchTakersToReduxStore(idTest);
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = takers => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'mark', 'date']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(takers, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, takers, idTest } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredTakerList = takers;

    if (searchInput.length > 1) {
      filteredTakerList = this.fuse(takers);
    }

    return (
      <Section header="Takers" subheader="Find Taker">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Taker</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <TakerTable takers={filteredTakerList} idTest={idTest} isLoading={isLoading} />
      </Section>
    );
  }
}

FindTaker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  takers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  idTest: PropTypes.string.isRequired,
  dispatchFetchTakersToReduxStore: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchFetchTakersToReduxStore: _id => dispatch(fetchTakersToReduxStore(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(FindTaker));
