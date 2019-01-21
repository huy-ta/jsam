import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';

const courseList = [
  { _id: 'luyenThiTHPT', name: 'THPT-Uni' },
  { _id: 'luyenThilenlop10', name: 'THCS-10' }
];

const levelList = [
  { _id: 'excellent', name: 'Excellent' },
  { _id: 'good', name: 'Good' },
  { _id: 'average', name: 'Average' }
];

const shiftList = [
  { _id: 'morning', name: 'Morning' },
  { _id: 'afternoon', name: 'Afternoon' },
  { _id: 'evening', name: 'Evening' }
];

const dayList = [
  { _id: 'monday', name: 'Monday' },
  { _id: 'tuesday', name: 'Tuesday' },
  { _id: 'wednesday', name: 'Wednesday' },
  { _id: 'thursday', name: 'Thursday' },
  { _id: 'friday', name: 'Friday' },
  { _id: 'saturday', name: 'Saturday' },
  { _id: 'sunday', name: 'Sunday' }
];

const roomList = [
  { _id: 'd35', name: 'D3-5' },
  { _id: 'd7', name: 'D7' },
  { _id: 'd9', name: 'D9' }
];

const styles = theme => ({
  root: {},
  textField: {},
  formControl: {},
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
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

const defaultInput = () => ({
  name: '',
  course: '',
  level: '',
  shift: '',
  day: '',
  room: ''
});

class AddClassForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Class name is required.'
    }
  ]);

  state = {
    input: defaultInput(),
    courseDropdownOpenState: false,
    levelDropdownOpenState: false,
    shiftDropdownOpenState: false,
    roomDropdownOpenState: false,
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {}
  };

  handleCourseDropdownClose = () => {
    this.setState({ courseDropdownOpenState: false });
  };

  handleCourseDropdownOpen = () => {
    this.setState({ courseDropdownOpenState: true });
  };

  handleLevelDropdownClose = () => {
    this.setState({ levelDropdownOpenState: false });
  };

  handleLevelDropdownOpen = () => {
    this.setState({ levelDropdownOpenState: true });
  };

  handleShiftDropdownClose = () => {
    this.setState({ shiftDropdownOpenState: false });
  };

  handleShiftDropdownOpen = () => {
    this.setState({ shiftDropdownOpenState: true });
  };

  handleRoomDropdownClose = () => {
    this.setState({ roomDropdownOpenState: false });
  };

  handleRoomDropdownOpen = () => {
    this.setState({ roomDropdownOpenState: true });
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  // FIXME: Needs refactoring

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.triggerLoadingState();

    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input } = this.state;
      try {
        await axios.post('/api/classes', input);
        this.handleReset();
        openSnackbar('Successfully added class.');
      } catch (err) {
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

  handleReset = () => {
    this.setState(() => ({
      input: defaultInput(),
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {}
    }));
  };

  render() {
    const { classes } = this.props;
    const {
      input,
      courseDropdownOpenState,
      levelDropdownOpenState,
      shiftDropdownOpenState,
      roomDropdownOpenState,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors
    } = this.state;

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
          <Grid spacing={24} container>
            <Grid item xs={12} lg={6}>
              <TextField
                id="class-name"
                label="Class Name"
                className={classes.textField}
                value={input.name}
                onChange={this.handleInputChange('name')}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || '' || validation.name.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="course">Course</InputLabel>
                <Select
                  open={courseDropdownOpenState}
                  onClose={this.handleCourseDropdownClose}
                  onOpen={this.handleCourseDropdownOpen}
                  value={input.course}
                  onChange={this.handleInputChange('course')}
                  inputProps={{
                    name: 'course',
                    id: 'course'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {courseList.map(course => (
                    <MenuItem value={course._id}>{course.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="level">Level</InputLabel>
                <Select
                  open={levelDropdownOpenState}
                  onClose={this.handleLevelDropdownClose}
                  onOpen={this.handleLevelDropdownOpen}
                  value={input.level}
                  onChange={this.handleInputChange('level')}
                  inputProps={{
                    name: 'level',
                    id: 'level'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {levelList.map(level => (
                    <MenuItem value={level._id}>{level.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="shift">Shift</InputLabel>
                <Select
                  open={shiftDropdownOpenState}
                  onClose={this.handleShiftDropdownClose}
                  onOpen={this.handleShiftDropdownOpen}
                  value={input.shift}
                  onChange={this.handleInputChange('shift')}
                  inputProps={{
                    name: 'shift',
                    id: 'shift'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {shiftList.map(shift => (
                    <MenuItem value={shift._id}>{shift.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} fullWidth>
              <Grid container alignItems="center" spacing={24}>
                <Grid item>
                  <FormLabel component="legend" labelPlacement="left">Day</FormLabel>
                </Grid>
                <Grid item>
                  <FormGroup value={input.day} row>
                    {dayList.map(day => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            key={day._id}
                            value={day._id}
                            onChange={this.handleInputChange('day')}
                            color="primary" />
                        }
                        label={day.name}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="room">Room</InputLabel>
                <Select
                  open={roomDropdownOpenState}
                  onClose={this.handleRoomDropdownClose}
                  onOpen={this.handleRoomDropdownOpen}
                  value={input.room}
                  onChange={this.handleInputChange('room')}
                  inputProps={{
                    name: 'room',
                    id: 'room'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {roomList.map(room => (
                    <MenuItem value={room._id}>{room.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={isLoading}>
                Create Student
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

AddClassForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddClassForm);
