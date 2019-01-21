import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import AutoSuggestChipInput from 'GlobalComponents/AutoSuggestChipInput';
import LinearProgress from '@material-ui/core/LinearProgress';
import { openSnackbar } from 'GlobalComponents/Notification';

const styles = theme => ({
  textfield: {
    marginTop: theme.spacing.unit * 0.2
  },
  button: {
    marginTop: theme.spacing.unit * 0.2,
    marginRight: theme.spacing.unit * 0.2
  },
  suggestion: {
    zIndex: 3
  },
  progress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 3
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  }
});

class AddSubjectForm extends React.Component {
  state = {
    input: {
      name: ''
    },
    existingSubjects: [],
    suggestions: [],
    teachersData: [],
    teachersId: [],
    hasEverSubmitted: false,
    isLoading: false,
    isFetching: false
  };

  async componentDidMount() {
    this.setState(() => ({ isFetching: true }));

    try {
      const responseTeachers = await axios.get('/api/teachers', {
        timeout: 10000
      });
      const responseSubjects = await axios.get('/api/subjects', {
        timeout: 10000
      });

      const teachers = responseTeachers.data.details.teachers.map(teacher => {
        let tempTeacher = teacher;
        tempTeacher.name = `${teacher.name} - ${teacher.email}`;
        return tempTeacher;
      });

      console.log(teachers);

      const suggestions = teachers.filter(teacher => !teacher.speciality);

      this.setState(() => ({
        suggestions,
        existingSubjects: responseSubjects.data.details.subjects
      }));
    } catch (error) {
      console.error(error);
    }

    this.setState(() => ({ isFetching: false }));
  }

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputItem = { ...input };
    inputItem[prop] = e.target.value;
    this.setState({ input: inputItem });
  };

  handleReset = () => {
    const input = {
      name: ''
    };
    this.setState({
      input,
      teachersData: [],
      teachersId: [],
      hasEverSubmitted: false
    });
  };

  handleSubmit = async e => {
    const { input, teachersId, existingSubjects } = this.state;
    e.preventDefault();
    this.triggerLoadingState();
    this.setState({ hasEverSubmitted: true });
    const subject = {
      name: input.name,
      teachers: teachersId
    };

    let exist = false;
    existingSubjects.forEach(subjectName => {
      if (subjectName.name === input.name) exist = true;
    });

    if (input.name !== '' && !exist) {
      try {
        await axios.post('/api/subjects', subject);
        this.handleReset();
        openSnackbar('Successfully added subject.');
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar("The server isn't responding at the moment. Please try again later.");
        } else {
          this.setState(() => ({ serverErrors: response.data.errors }));
        }
      }
    } else openSnackbar('This subject has already existed.');

    this.turnOffLoadingState();
  };

  handleAddTeacher = chipValue => {
    const { teachersData, teachersId, suggestions } = this.state;
    let tempTeachersId = teachersId;
    suggestions.forEach(teacher => {
      if (teacher.name === chipValue) {
        tempTeachersId = [...tempTeachersId, teacher._id];
      }
    });
    let tempTeacherData = teachersData;
    tempTeacherData = [...tempTeacherData, chipValue];
    this.setState({
      teachersData: tempTeacherData,
      teachersId: tempTeachersId
    });
  };

  handleDeleteTeacher = index => {
    const { teachersData, teachersId } = this.state;
    const tempteachersData = teachersData;
    const tempteachersId = teachersId;
    tempteachersData.splice(index, 1);
    tempteachersId.splice(index, 1);
    this.setState({
      teachersData: tempteachersData,
      teachersId: tempteachersId
    });
  };

  render() {
    const { classes } = this.props;
    const { input, suggestions, teachersData, hasEverSubmitted, isLoading, isFetching } = this.state;

    const teacherSuggestions = suggestions.filter(suggestion => !teachersData.includes(suggestion.name));

    const Loading = () => (
      <Grid container spacing={24} direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Connecting with server...</Typography>
        </Grid>
      </Grid>
    );

    const LoadingSubmit = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return !isFetching ? (
      <React.Fragment>
        {isLoading && <LoadingSubmit />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12} lg={5}>
              <TextField
                id="subject-name"
                label="Subject name"
                value={input.name}
                onChange={this.handleInputChange('name')}
                className={classes.textfield}
                error={!input.name && hasEverSubmitted}
                helperText={input.name === '' && hasEverSubmitted ? 'Subject name is required' : ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={7} className={classes.suggestion}>
              <AutoSuggestChipInput
                label="Teacher list"
                suggestions={teacherSuggestions}
                fullWidth
                chipValues={teachersData}
                handleAddChipToForm={this.handleAddTeacher}
                handleRemoveChipFromForm={this.handleDeleteTeacher}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={isLoading}>
                Create Subject
              </Button>
              <Button
                type="reset"
                className={classes.button}
                variant="text"
                color="primary"
                onClick={this.handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    ) : (
      <Loading />
    );
  }
}

AddSubjectForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddSubjectForm);
