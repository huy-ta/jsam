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

import { fetchSubjectsToReduxStore } from 'Services/subjects/actions';
import SubjectTable from "./SubjectTable"

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

class FindSubject extends React.Component {

  state = {
    searchInput: '',
    isLoading: false
  }

  isMounted = false;

  componentDidMount = async () => {
    this.isMounted = true;

    this.triggerLoadingState();

    try {
      const { dispatchFetchSubjectsToReduxStore } = this.props;
      await dispatchFetchSubjectsToReduxStore();
    }
    catch (err) {
      const doNothing = () => { };
      doNothing();
    }

    this.turnOffLoadingState();
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = subjects => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(subjects, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  triggerLoadingState = () => {
    this.setState({ isLoading: true });
  };

  turnOffLoadingState = () => {
    this.setState({ isLoading: false });
  };

  render() {

    const { classes, subjects } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredSubjectList = subjects;
    if (searchInput.length > 1) {
      filteredSubjectList = this.fuse(subjects);
    }

    const Loading = () => (
      <Paper className={classes.loadingPaper}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.typography}>Đang tải dữ liệu từ server, vui lòng chờ...</Typography>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <Section header="Subject" subheader="Find Subject">
        <Paper className={classes.root} elevation={6}>
          <Typography className={classes.typography}>Nhập thông tin tìm kiếm</Typography>
          <TextField
            id="search-input"
            label="Subject name"
            value={searchInput}
            fullWidth
            onChange={this.handleSearchInputChange}
          />
        </Paper>

        {isLoading ? <Loading /> : <SubjectTable subjects={filteredSubjectList} />}
      </Section>
    )
  }
}
FindSubject.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  subjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchSubjectsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ subjects }) => ({ subjects });

const mapDispatchToProps = dispatch => ({
  dispatchFetchSubjectsToReduxStore: () => dispatch(fetchSubjectsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindSubject));