import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Section from 'Shells/Section';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fuse from 'fuse.js';

import { fetchTeachersToReduxStore } from 'Services/teachers/actions';
import TeacherTable from './TeacherTable';

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

class FindTeacher extends React.Component {
  state = {
    searchInput: '',
    isLoading: false
  };

  isMounted = false;

  componentDidMount = async () => {
    this.isMounted = true;

    this.triggerLoadingState();

    try {
      const { dispatchFetchTeachersToReduxStore } = this.props;
      await dispatchFetchTeachersToReduxStore();
    } catch (err) {
      console.error(err);
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

  fuse = teachers => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'gender', 'facebook', 'email', 'phone', 'speciality.name']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(teachers, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  triggerLoadingState = () => {
    this.setState({ isLoading: true });
  };

  turnOffLoadingState = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { classes, teachers } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredTeacherList = teachers;
    if (searchInput.length > 1) {
      filteredTeacherList = this.fuse(teachers);
    }

    const Loading = () => (
      <Paper className={classes.loadingPaper}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.typography}>Loading teachers, please wait...</Typography>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <Section header="Teacher" subheader="Find Teacher">
        <Paper className={classes.root} elevation={6}>
          <Typography className={classes.typography} variant="h6">
            Search info
          </Typography>
          <TextField
            id="search-input"
            label="Teacher name"
            value={searchInput}
            fullWidth
            onChange={this.handleSearchInputChange}
          />
        </Paper>

        {isLoading ? <Loading /> : <TeacherTable teachers={filteredTeacherList} />}
      </Section>
    );
  }
}
FindTeacher.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  teachers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchTeachersToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ teachers }) => ({ teachers });

const mapDispatchToProps = dispatch => ({
  dispatchFetchTeachersToReduxStore: () => dispatch(fetchTeachersToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindTeacher));
