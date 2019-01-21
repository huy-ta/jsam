import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Slide from '@material-ui/core/Slide';

import InfoIcon from '@material-ui/icons/Info';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import CloseIcon from '@material-ui/icons/Close';
import StudentIcon from '@material-ui/icons/LocalLibrary';
import TeacherIcon from '@material-ui/icons/School';
import AssistantIcon from '@material-ui/icons/Person';
import AttendanceIcon from '@material-ui/icons/CheckBox';
import FeeIcon from '@material-ui/icons/AttachMoney';

import { fetchPhaseToReduxStore } from 'Services/phases/actions';

import PhaseInfo from './components/PhaseInfo';
import PhaseSummary from './components/PhaseSummary';
import PhaseTeachers from './components/PhaseTeachers';
import PhaseAssistants from './components/PhaseAssistants';
import PhaseStudents from './components/PhaseStudents';
import PhaseFees from './components/PhaseFees';
import ManageStudySession from '../../StudySession/ManageStudySession';

const styles = theme => ({
  root: {},
  paper: {
    background: theme.palette.grey[50]
  },
  appBar: {
    position: 'relative'
  },
  container: {
    padding: theme.spacing.unit
  },
  relative: {
    minHeight: 'min-content',
    height: '100%',
    display: 'block',
    position: 'relative',
    paddingBottom: theme.spacing.unit * 1.5
  },
  flex: {
    flex: 1
  },
  bottomNav: {
    position: 'absolute',
    left: '0',
    bottom: '0',
    width: '100%',
    boxShadow: theme.shadows[2]
  }
});

const Transition = props => <Slide direction="up" {...props} />;

const FullScreenDialog = props => {
  const [navValue, setNavValue] = useState('info');
  const [showPhaseInfo, setShowPhaseInfo] = useState(true);
  const [showPhaseSummary, setShowPhaseSummary] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showAssistants, setShowAssistants] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const { classes, studyPhaseId, handleClose, open, dispatchFetchPhaseToReduxStore, phase, studentClass } = props;

  const handleChangeNavigation = (event, value) => {
    setNavValue(value);

    setShowPhaseInfo(false);
    setShowTeachers(false);
    setShowPhaseSummary(false);
    setShowAssistants(false);
    setShowStudents(false);
    setShowAttendance(false);
    setShowFees(false);

    switch (value) {
      case 'info': {
        setShowPhaseInfo(true);
        break;
      }
      case 'summary': {
        setShowPhaseSummary(true);
        break;
      }
      case 'teachers': {
        setShowTeachers(true);
        break;
      }
      case 'assistants': {
        setShowAssistants(true);
        break;
      }
      case 'students': {
        setShowStudents(true);
        break;
      }
      case 'attendance': {
        setShowAttendance(true);
        break;
      }
      case 'fees': {
        setShowFees(true);
        break;
      }
      default: {
        setShowPhaseInfo(false);
        setShowTeachers(false);
        setShowPhaseSummary(false);
        setShowAssistants(false);
        setShowStudents(false);
        setShowAttendance(false);
      }
    }
  };

  const fetchPhase = async () => {
    await dispatchFetchPhaseToReduxStore(studyPhaseId);
  };

  useEffect(
    () => {
      if (open) {
        (async () => {
          await fetchPhase();
        })();
      }
    },
    [open]
  );

  return (
    <div>
      <Dialog
        className={classes.root}
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        classes={{
          paper: classes.paper
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Manage Study Phase &quot;{phase.name}&quot; of Class &quot;{studentClass.name}&quot;
            </Typography>
            <IconButton color="inherit" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.relative}>
          <div className={classes.container}>
            <PhaseInfo phase={phase} show={showPhaseInfo} />
            <PhaseTeachers phase={phase} show={showTeachers} fetchPhase={fetchPhase} />
            <PhaseAssistants phase={phase} show={showAssistants} fetchPhase={fetchPhase} />
            <PhaseStudents phase={phase} show={showStudents} fetchPhase={fetchPhase} />
            <PhaseFees phase={phase} show={showFees} />
            <PhaseSummary phase={phase} show={showPhaseSummary} />
            <ManageStudySession phase={phase} show={showAttendance} />
          </div>
          <BottomNavigation value={navValue} onChange={handleChangeNavigation} showLabels className={classes.bottomNav}>
            <BottomNavigationAction label="Info" value="info" icon={<InfoIcon />} />
            <BottomNavigationAction label="Teachers" value="teachers" icon={<TeacherIcon />} />
            <BottomNavigationAction label="Assistants" value="assistants" icon={<AssistantIcon />} />
            <BottomNavigationAction label="Students" value="students" icon={<StudentIcon />} />
            <BottomNavigationAction label="Attendance" value="attendance" icon={<AttendanceIcon />} />
            <BottomNavigationAction label="Fees" value="fees" icon={<FeeIcon />} />
            {/* <BottomNavigationAction label="Summary" value="summary" icon={<FavoriteIcon />} /> */}
          </BottomNavigation>
        </div>
      </Dialog>
    </div>
  );
};

FullScreenDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  studyPhaseId: PropTypes.string.isRequired,
  studentClass: PropTypes.shape({}).isRequired,
  dispatchFetchPhaseToReduxStore: PropTypes.func.isRequired,
  phase: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ phase }) => ({
  phase
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchPhaseToReduxStore: phaseId => dispatch(fetchPhaseToReduxStore(phaseId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FullScreenDialog));
