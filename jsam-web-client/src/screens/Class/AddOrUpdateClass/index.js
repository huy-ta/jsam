import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import withStyles from '@material-ui/core/styles/withStyles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { openSnackbar } from 'GlobalComponents/Notification';

import ClassBaseInfoForm from './components/ClassBaseInfoForm';
import ClassScheduleForm from './components/ClassScheduleForm';
import ClassInfoReview from './components/ClassInfoReview';
import SuccessNotice from './components/SuccessNotice';

// FIXME: This screen needs serious refactoring (Lift state up)

const styles = theme => ({
  stepper: {
    background: 'none',
    padding: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 2}px`
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit
  }
});

class AddOrUpdateClass extends React.Component {
  state = {
    steps: ['Class Basic Information', 'Class Schedule Information', 'Confirmation'],
    activeStep: 0,
    classBaseInfo: {},
    classSchedules: [],
    courseList: [],
    roomList: []
  };

  componentWillMount = async () => {
    const { classBaseInfo, classSchedules } = this.props;

    if (classBaseInfo) {
      this.setState(() => ({ classBaseInfo }));
    }

    if (classSchedules) {
      this.setState(() => ({ classSchedules }));
    }

    try {
      const course = await axios.get('/api/courses');
      const courseList = [...course.data.details.courses];

      const room = await axios.get('/api/rooms');
      const roomList = [...room.data.details.rooms];

      this.setState({ courseList, roomList });
    } catch (err) {
      console.log(err);
    }
  };

  resetState = () => {
    this.setState(() => ({
      classBaseInfo: {},
      classSchedules: []
    }));
  };

  moveOneStepForward = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  moveOneStepBackward = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  moveToInitialStep = () => {
    this.setState(() => ({
      activeStep: 0
    }));
  };

  updateClassBaseInfoForReview = newClassBaseInfo => {
    const { handleNavigationBlock, classBaseInfo, mode } = this.props;
    handleNavigationBlock(newClassBaseInfo);

    if (mode === 'edit') {
      this.setState(() => ({
        classBaseInfo: {
          _id: classBaseInfo._id,
          name: newClassBaseInfo.name,
          course: newClassBaseInfo.course
        }
      }));
    } else {
      this.setState(() => ({
        classBaseInfo: {
          name: newClassBaseInfo.name,
          course: newClassBaseInfo.course
        }
      }));
    }
  };

  updateClassScheduleInfoForReview = classSchedules => {
    const { handleNavigationBlock } = this.props;
    const isBlocking = handleNavigationBlock(classSchedules);
    if (!isBlocking) {
      const { classBaseInfo } = this.state;
      handleNavigationBlock(classBaseInfo);
    }

    this.setState(() => ({ classSchedules }));
  };

  submitForm = async () => {
    try {
      const { classBaseInfo, classSchedules, courseList } = this.state;

      const courseId = courseList.filter(course => course.name === classBaseInfo.course)[0]._id;

      const requestPayload = {
        name: classBaseInfo.name,
        course: courseId,
        normalSchedule: classSchedules
      };

      const { handleSubmit } = this.props;
      let isSuccess = false;
      if (classBaseInfo._id) {
        isSuccess = await handleSubmit(requestPayload, classBaseInfo._id);
      } else {
        isSuccess = await handleSubmit(requestPayload);
      }

      if (isSuccess) {
        this.moveOneStepForward();
        this.handleNavigationBlock({});
      } else {
        openSnackbar('Some error happened while your request was being processed.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { classes, mode } = this.props;
    const { steps, activeStep, classBaseInfo, classSchedules, courseList, roomList } = this.state;

    return (
      <React.Fragment>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <SuccessNotice parentClasses={classes} handleReset={this.moveToInitialStep} mode={mode} />
          ) : (
            <React.Fragment>
              <ClassBaseInfoForm
                parentClasses={classes}
                handleNext={this.moveOneStepForward}
                show={activeStep === 0}
                updateClassBaseInfoForReview={this.updateClassBaseInfoForReview}
                classBaseInfo={mode === 'add' ? {} : classBaseInfo}
                courseList={courseList}
              />
              <ClassScheduleForm
                parentClasses={classes}
                handleNext={this.moveOneStepForward}
                handleBack={this.moveOneStepBackward}
                show={activeStep === 1}
                updateClassScheduleInfoForReview={this.updateClassScheduleInfoForReview}
                classSchedules={mode === 'add' ? [] : classSchedules}
                roomList={roomList}
              />
              <ClassInfoReview
                parentClasses={classes}
                submitCreateClassForm={this.submitForm}
                handleBack={this.moveOneStepBackward}
                classBaseInfo={classBaseInfo}
                classSchedules={classSchedules}
                show={activeStep === 2}
                mode={mode}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

AddOrUpdateClass.defaultProps = {
  classBaseInfo: null,
  classSchedules: null
};

AddOrUpdateClass.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleNavigationBlock: PropTypes.func.isRequired,
  classBaseInfo: PropTypes.shape({}),
  classSchedules: PropTypes.arrayOf(PropTypes.shape({})),
  mode: PropTypes.string.isRequired
};

export default withStyles(styles)(AddOrUpdateClass);
