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
// import axios from 'axios';

import { fetchCoursesToReduxStore } from 'Services/courses/actions';
import CourseTable from "./CourseTable"



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

// let foundCourse = [];

class FindCourse extends React.Component {

  state = {
    searchInput: '',
    isLoading: false
  }

  isMounted = false;


  componentDidMount = async () => {
    this.isMounted = true;

    this.triggerLoadingState();

    try {

      // const response = await axios.get(`/api/courses`);
      // foundCourse = response.data.details.courses;
      // let test = [];
      // const foundClass = foundCourse.forEach(element => {

      //   Promise.all()
      //   let classes = element.classes.map(async clas => {
      //     const responseClass = await axios.get(`/api/classes/${clas}`);
      //     return {
      //       className: responseClass.data.details.name
      //     }
      //   })

      //   test = {
      //     ...element,
      //     className: classes
      //   }
      // });

      
      // console.log(test);


      const { dispatchFetchCoursesToReduxStore } = this.props;
      await dispatchFetchCoursesToReduxStore();
    }
    catch (err) {
      console.log(err);
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

  fuse = courses => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'floor', 'capacity']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(courses, options);
    return fuse.search(searchInput);
  };

  triggerLoadingState = () => {
    this.setState({ isLoading: true });
  };

  turnOffLoadingState = () => {
    this.setState({ isLoading: false });
  };

  render() {

    const { classes, courses } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredCourseList = courses;
    if (searchInput.length > 1) {
      filteredCourseList = this.fuse(courses);
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
      <Section header="Courses" subheader="Find Course">
        <Paper className={classes.root} elevation={6}>
          <Typography className={classes.typography}>Find Course</Typography>
          <TextField
            id="search-input"
            label="Course name"
            value={searchInput}
            fullWidth
            onChange={this.handleSearchInputChange}
          />
        </Paper>

        {isLoading ? <Loading /> : <CourseTable courses={filteredCourseList} />}
      </Section>
    )
  }
}
FindCourse.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  courses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchCoursesToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ courses }) => ({ courses });

const mapDispatchToProps = dispatch => ({
  dispatchFetchCoursesToReduxStore: () => dispatch(fetchCoursesToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindCourse));