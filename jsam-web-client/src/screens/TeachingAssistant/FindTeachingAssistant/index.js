import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import Section from 'Shells/Section';
import { fetchTeachingAssistantsToReduxStore } from 'Services/teachingAssistants/actions';

import TeachingAssistantTable from './components/TeachingAssistantTable';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  },
  loadingPaper: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
});

class FindTeachingAssistant extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  isMounted = false;

  componentDidMount = async () => {
    this.isMounted = true;
    this.triggerLoadingState();
    try {
      const { dispatchFetchTeachingAssistantsToReduxStore } = this.props;
      await dispatchFetchTeachingAssistantsToReduxStore();
    } catch (err) {
      console.log(err);
    }
    this.turnOffLoadingState();
  };

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = teachingAssistants => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'gender', 'role.name', 'dateOfBirth', 'email', 'facebook', 'phone']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(teachingAssistants, options);
    return fuse.search(searchInput);
  };

  triggerLoadingState = () => {
    this.setState({ isLoading: true });
  };

  turnOffLoadingState = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { classes, teachingAssistants } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredTeachingAssistantList = teachingAssistants;
    if (searchInput.length > 1) {
      filteredTeachingAssistantList = this.fuse(teachingAssistants);
    }

    const Loading = () => (
      <Paper className={classes.loadingPaper}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.typography}>Loading data from server, please wait...</Typography>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <Section header="Teaching Assistants" subheader="Find Teaching Assistant">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Teaching Assistant</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        {isLoading ? <Loading /> : <TeachingAssistantTable teachingAssistants={filteredTeachingAssistantList} />}
      </Section>
    );
  }
}

FindTeachingAssistant.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  teachingAssistants: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchTeachingAssistantsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ teachingAssistants }) => ({ teachingAssistants });

const mapDispatchToProps = dispatch => ({
  dispatchFetchTeachingAssistantsToReduxStore: () => dispatch(fetchTeachingAssistantsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindTeachingAssistant));
