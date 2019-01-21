import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Section from 'Shells/Section';
import { fetchRegistrationCodesToReduxStore } from 'Services/registration-codes/actions';

import RegistrationCodeTable from './components/RegistrationCodeTable';

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
class FindRegistrationCode extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  async componentDidMount() {
    const { dispatchFetchRegistrationCodesToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchRegistrationCodesToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = registrationCodes => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['code', 'userType', 'createdDate', 'validPeriod']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(registrationCodes, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, registrationCodes } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredRegistrationCodeList = registrationCodes;
    if (searchInput.length > 1) {
      filteredRegistrationCodeList = this.fuse(registrationCodes);
    }

    return (
      <Section header="Registration Codes" subheader="Find Registration Code">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Registration Code</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <RegistrationCodeTable registrationCodes={filteredRegistrationCodeList} isLoading={isLoading} />
      </Section>
    );
  }
}

FindRegistrationCode.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  registrationCodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchRegistrationCodesToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ registrationCodes }) => ({ registrationCodes });

const mapDispatchToProps = dispatch => ({
  dispatchFetchRegistrationCodesToReduxStore: () => dispatch(fetchRegistrationCodesToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindRegistrationCode));
