import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';
import PaperLoading from 'GlobalComponents/PaperLoading';

const styles = theme => ({
  progress: {
    position: 'absolute',
    width: '100%',
    left: '0',
    bottom: '0',
    zIndex: 5
  },
  overlay: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: theme.palette.grey[200],
    zIndex: 4,
    opacity: 0.7
  }
});

class ClassBaseInfoForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Class name is required'
    },
    {
      field: 'course',
      method: 'isEmpty',
      validWhen: false,
      message: 'Course name is required'
    }
  ]);

  state = {
    input: {
      name: '',
      course: ''
    },
    statusDropdownOpenState: false,
    serverErrors: {},
    hasEverSubmitted: false,
    validation: this.validator.valid(),
    isLoading: false
  };

  componentDidMount() {
    const { classBaseInfo } = this.props;

    const { input } = this.state;
    const inputTemp = { ...input };
    if (classBaseInfo.name) {
      inputTemp.name = classBaseInfo.name;
    }
    if (classBaseInfo.course) {
      inputTemp.course = classBaseInfo.course.name;
    }
    this.setState(() => ({ input: inputTemp }));
  }

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    const validation = this.validator.validate(input);

    this.setState(() => ({
      validation,
      serverErrors: {},
      hasEverSubmitted: true
    }));

    return validation;
  };

  handleInputChange = fieldName => e => {
    const { updateClassBaseInfoForReview } = this.props;
    let { value } = e.target;
    const { input } = this.state;
    input[fieldName] = value;
    this.setState(() => ({ input }));
    updateClassBaseInfoForReview(input);
  };

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpenState: true });
  };

  checkIfModuleIdDuplicated = async () => {
    const { input } = this.state;
    const { moduleId } = input;

    try {
      const response = await axios.get(`/api/modules/${moduleId}`);
      if (response.data.success) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  handleClickNext = async () => {
    const { handleNext, updateClassBaseInfoForReview } = this.props;
    const { input } = this.state;
    if (input.course === '' || input.name === '') openSnackbar('Either course or class name is not filled.');
    else {
      this.triggerLoadingState();
      updateClassBaseInfoForReview(input);
      handleNext();
      this.turnOffLoadingState();
    }
  };

  render() {
    const {
      input,
      validation: stateValidation,
      hasEverSubmitted,
      serverErrors,
      isLoading,
      statusDropdownOpenState
    } = this.state;
    const { parentClasses, show, classes, courseList } = this.props;

    const validation = hasEverSubmitted ? this.validator.validate(input) : stateValidation;
    if (show) {
      return (
        <React.Fragment>
          {courseList.length === 0 && <PaperLoading />}
          <Typography variant="h6" gutterBottom>
            Class Basic Information
          </Typography>
          <form>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Class name"
                  fullWidth
                  autoFocus
                  value={input.name}
                  onChange={this.handleInputChange('name')}
                  error={!!serverErrors.name || validation.name.isInvalid}
                  helperText={serverErrors.name || '' || validation.name.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth noValidate>
                  <InputLabel htmlFor="course">Course name</InputLabel>
                  <Select
                    open={statusDropdownOpenState}
                    onClose={this.handleStatusDropdownClose}
                    onOpen={this.handleStatusDropdownOpen}
                    value={input.course}
                    onChange={this.handleInputChange('course')}
                    inputProps={{
                      name: 'course',
                      id: 'course'
                    }}
                  >
                    {courseList.map(course => (
                      <MenuItem key={course._id} value={course.name}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
          <div className={parentClasses.buttons}>
            <Button variant="contained" color="primary" onClick={this.handleClickNext} className={parentClasses.button}>
              Next
            </Button>
          </div>
          {isLoading && (
            <React.Fragment>
              <div className={classes.overlay} />
              <LinearProgress className={classes.progress} color="secondary" />
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }

    return null;
  }
}

ClassBaseInfoForm.defaultProps = {
  classBaseInfo: null
};

ClassBaseInfoForm.propTypes = {
  parentClasses: PropTypes.shape({}).isRequired,
  handleNext: PropTypes.func.isRequired,
  updateClassBaseInfoForReview: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
  courseList: PropTypes.arrayOf(PropTypes.any).isRequired,
  classBaseInfo: PropTypes.shape({})
};

export default withStyles(styles)(ClassBaseInfoForm);
