/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { connect } from 'react-redux';
import { InlineDatePicker } from 'material-ui-pickers';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TimeInput from 'material-ui-time-picker';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import PaperLoading from 'GlobalComponents/PaperLoading';
import { fetchRoomsToReduxStore } from 'Services/rooms/actions';
import { fetchPhaseToReduxStore } from 'Services/phases/actions';
import { fetchFaultsToReduxStore } from 'Services/faults/actions';

import TeacherAttendanceTable from './components/TeacherAttendanceTable';
import TeachingAssistantAttendanceTable from './components/TeachingAssistantAttendanceTable';
import StudentAttendanceTable from './components/StudentAttendanceTable';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    position: 'relative'
  },
  timePicker: {
    marginLeft: theme.spacing.unit
  }
});

const ManageStudySession = props => {
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const [fetchedSession, setFetchedSession] = useState(null);
  const [sessionDate, setSessionDate] = useState(moment());
  const {
    classes,
    phase,
    show,
    roomList,
    dispatchFetchRoomsToReduxStore,
    dispatchFetchPhase,
    dispatchFetchFaults,
    faults
  } = props;

  const handleReset = () => {
    setSelectedRoom('');
    setStartTime('00:00');
    setEndTime('00:00');
    setFetchedSession(null);
  };

  const handleChangeTime = prop => async time => {
    const fullTime = time.toString().split(' ');
    const realTimeArray = fullTime[4].split(':');
    const neededTime = `${realTimeArray[0]}:${realTimeArray[1]}`;
    let fieldsToBeUpdated = {};
    if (prop === 'startTime') {
      setStartTime(neededTime);
      fieldsToBeUpdated.startTime = neededTime;
    } else if (prop === 'endTime') {
      setEndTime(neededTime);
      fieldsToBeUpdated.endTime = neededTime;
    }
    if (selectedSessionId) {
      try {
        await axios.put(`/api/study-sessions/${selectedSessionId}`, fieldsToBeUpdated);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSessionDateChange = async date => {
    setSessionDate(date);
    if (selectedSessionId) {
      try {
        await axios.put(`/api/study-sessions/${selectedSessionId}`, {
          date
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePrepareSession = async () => {
    const selectedSessionTemp = phase.sessions.filter(session => session._id === selectedSessionId)[0];

    if (selectedSessionTemp.activated) {
      setIsFetchingSession(true);

      try {
        const response = await axios.get(`/api/study-sessions/${selectedSessionId}`);

        const { foundStudySession } = response.data.details;

        if (foundStudySession.startTime) {
          setStartTime(foundStudySession.startTime);
        }
        if (foundStudySession.endTime) {
          setEndTime(foundStudySession.endTime);
        }
        if (foundStudySession.date) {
          setSessionDate(moment(foundStudySession.date));
        }
        if (foundStudySession.room) {
          setSelectedRoom(foundStudySession.room);
        }

        if (faults.length === 0) {
          await dispatchFetchFaults();
        }

        setFetchedSession(foundStudySession);
      } catch (err) {
        console.error(err);
      }

      setIsFetchingSession(false);
    }
  };

  const handleActivateSession = async () => {
    try {
      await axios.put(`/api/study-phases/${phase._id}/study-sessions/${selectedSessionId}`);
      await dispatchFetchPhase(phase._id);
      await handlePrepareSession();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(
    () => {
      if (show) {
        (async () => {
          await dispatchFetchRoomsToReduxStore();
        })();
      }
    },
    [show]
  );

  useEffect(
    () => {
      if (selectedSessionId) {
        handleReset();
        handlePrepareSession();
      }
    },
    [selectedSessionId]
  );

  if (show) {
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          {isFetchingSession && <PaperLoading />}
          <Typography variant="h6">Select Study Session</Typography>
          <Select
            open={isSessionDropdownOpen}
            onClose={() => {
              setIsSessionDropdownOpen(false);
            }}
            onOpen={() => {
              setIsSessionDropdownOpen(true);
            }}
            value={selectedSessionId}
            onChange={e => {
              setSelectedSessionId(e.target.value);
            }}
            inputProps={{
              name: 'session',
              id: 'session'
            }}
            fullWidth
          >
            {phase.sessions.map(session => (
              <MenuItem key={session._id} value={session._id}>
                {session.name}
              </MenuItem>
            ))}
          </Select>
        </Paper>
        <Paper className={classes.root}>
          <Typography variant="h6">Study Session Information</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl} fullWidth noValidate>
                <InputLabel htmlFor="room">Room</InputLabel>
                <Select
                  open={isRoomDropdownOpen}
                  onClose={() => {
                    setIsRoomDropdownOpen(false);
                  }}
                  onOpen={() => {
                    setIsRoomDropdownOpen(true);
                  }}
                  value={selectedRoom}
                  onChange={async e => {
                    const { value } = e.target;
                    setSelectedRoom(value);
                    if (selectedSessionId) {
                      try {
                        await axios.put(`/api/study-sessions/${selectedSessionId}`, { room: value });
                      } catch (err) {
                        console.error(err);
                      }
                    }
                  }}
                  inputProps={{
                    name: 'room',
                    id: 'room'
                  }}
                >
                  {roomList.map(room => (
                    <MenuItem key={room._id} value={room._id}>
                      {room.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InlineDatePicker
                keyboard
                format="DD/MM/YYYY"
                label="Start date"
                value={sessionDate}
                onChange={handleSessionDateChange}
                mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Start Time
                <TimeInput
                  className={classes.timePicker}
                  mode="24h"
                  onChange={handleChangeTime('startTime')}
                  value={moment(startTime, 'H:mm').toDate()}
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                End Time
                <TimeInput
                  className={classes.timePicker}
                  mode="24h"
                  onChange={handleChangeTime('endTime')}
                  value={moment(endTime, 'H:mm').toDate()}
                />
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={handleActivateSession}
                variant="contained"
                color="primary"
                disabled={!!fetchedSession || !selectedSessionId}
              >
                Activate Session
              </Button>
            </Grid>
          </Grid>
          {isFetchingSession && <PaperLoading />}
        </Paper>
        {fetchedSession && (
          <React.Fragment>
            <Paper className={classes.root}>
              <Typography variant="h6">Teacher Attendance</Typography>
              <TeacherAttendanceTable session={fetchedSession} faults={faults} />
              {isFetchingSession && <PaperLoading />}
            </Paper>
            <Paper className={classes.root}>
              <Typography variant="h6">Teaching Assistant Attendance</Typography>
              <TeachingAssistantAttendanceTable session={fetchedSession} faults={faults} />
              {isFetchingSession && <PaperLoading />}
            </Paper>
            <Paper className={classes.root}>
              <Typography variant="h6">Student Attendance</Typography>
              <StudentAttendanceTable session={fetchedSession} faults={faults} />
              {isFetchingSession && <PaperLoading />}
            </Paper>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
  return null;
};

ManageStudySession.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired,
  show: PropTypes.bool.isRequired,
  roomList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchRoomsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ rooms, faults }) => ({
  roomList: rooms,
  faults
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchRoomsToReduxStore: () => dispatch(fetchRoomsToReduxStore()),
  dispatchFetchPhase: phaseId => dispatch(fetchPhaseToReduxStore(phaseId)),
  dispatchFetchFaults: () => dispatch(fetchFaultsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ManageStudySession));
