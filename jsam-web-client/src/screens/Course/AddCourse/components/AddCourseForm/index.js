import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import AutoSuggestChipInput from 'GlobalComponents/AutoSuggestChipInput';
import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';
// import ClassTable from './components/ClassTable';

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
  },
  formControl: {}
});

const defaultInput = () => ({
  name: '',
  subject: '',
  classes: []
});

class AddCourseForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Course name is required.'
    },
    {
      field: 'subject',
      method: 'isEmpty',
      validWhen: false,
      message: 'Subject is required.'
    }
  ]);

  state = {
    input: defaultInput(),
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {},
    subjectList: [],
    classList: [],
    classListChoose: [],
    statusDropdownOpenStateSubject: false,
    suggestions: []
  };

  isMounted = false;

  componentWillMount = async () => {
    this.isMounted = true;
    try {
      const resSubjects = await axios.get('/api/subjects');
      const resClasses = await axios.get('/api/classes');
      if (this.isMounted) {
        this.setState(() => ({
          suggestions: resClasses.data.details.classes,
          subjectList: resSubjects.data.details.subjects
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleStatusDropdownCloseSubject = () => {
    this.setState({ statusDropdownOpenStateSubject: false });
  };

  handleStatusDropdownOpenSubject = () => {
    this.setState({ statusDropdownOpenStateSubject: true });
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  handleInputChange = prop => e => {
    const { input } = this.state;

    const inputItem = input;
    inputItem[prop] = e.target.value;
    this.setState({ input: inputItem });
  };

  handleReset = () => {
    this.setState({
      input: defaultInput(),
      classList: [],
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {}
    });
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.triggerLoadingState();
    this.setState({ hasEverSubmitted: true });

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input } = this.state;
      try {
        await axios.post('/api/courses', input);
        this.handleReset();
        openSnackbar('Successfully added course.');
      } catch (err) {
        console.log(err);
        const { response } = err;
        if (response.status === 504) {
          openSnackbar("The server isn't responding at the moment. Please try again later.");
        } else {
          this.setState(() => ({ serverErrors: response.data.errors }));
        }
      }
    }

    this.turnOffLoadingState();
  };

  handleDelete = value => {
    const { classListChoose } = this.state;
    let delClassListChoose = classListChoose.filter(clas => clas._id !== value);
    this.setState(() => ({ classListChoose: delClassListChoose }));
  };

  handleAddClass = chipValue => {
    const { classList, suggestions, input } = this.state;
    let tempInput = input;
    suggestions.forEach(clas => {
      if (clas.name === chipValue) {
        tempInput.classes = [...tempInput.classes, clas._id];
      }
    });
    let tempClassList = classList;
    tempClassList = [...tempClassList, chipValue];
    this.setState({
      classList: tempClassList,
      input: tempInput
    });
  };

  handleDeleteClass = index => {
    const { classList, input } = this.state;
    const tempClassList = classList;
    const tempInput = input;
    tempClassList.splice(index, 1);
    tempInput.classes.splice(index, 1);
    this.setState({
      classList: tempClassList,
      input: tempInput
    });
  };

  render() {
    const { classes } = this.props;
    const {
      input,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors,
      subjectList,
      classList,
      statusDropdownOpenStateSubject,
      // statusDropdownOpenStateClass,
      suggestions
    } = this.state;

    const classSuggestions = suggestions.filter(suggestion => !classList.includes(suggestion.name));

    let validation = hasEverSubmitted ? this.validator.validate(input) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12} lg={6}>
              <TextField
                id="course-name"
                label="Course Name"
                value={input.name}
                onChange={this.handleInputChange('name')}
                className={classes.textfield}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || '' || validation.name.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="subject">Subject</InputLabel>
                <Select
                  open={statusDropdownOpenStateSubject}
                  onClose={this.handleStatusDropdownCloseSubject}
                  onOpen={this.handleStatusDropdownOpenSubject}
                  value={input.subjects}
                  onChange={this.handleInputChange('subject')}
                  inputProps={{
                    name: 'subject',
                    id: 'subject'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {subjectList.map(subject => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={12}>
              <AutoSuggestChipInput
                label="List Classes"
                suggestions={classSuggestions}
                fullWidth
                chipValues={classList}
                handleAddChipToForm={this.handleAddClass}
                handleRemoveChipFromForm={this.handleDeleteClass}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={isLoading}>
                Create Course
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
    );
  }
}

AddCourseForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddCourseForm);
