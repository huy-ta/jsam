import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TimeInput from 'material-ui-time-picker';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Delete from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

import theme from 'Config/styles/theme';
import { openSnackbar } from 'GlobalComponents/Notification';

const styles = () => ({
  highElevation: {
    zIndex: 3
  },
  lowElevation: {
    zIndex: 2
  },
  lowerElevation: {
    zIndex: 1
  },
  timePicker: {
    marginLeft: theme.spacing.unit * 2
  },
  table: {
    marginTop: theme.spacing.unit * 2
  }
});

const weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class ClassScheduleForm extends React.Component {
  state = {
    schedule: {
      weekDay: '',
      startTime: '',
      endTime: '',
      room: ''
    },
    rows: [],
    roomDropdownOpenState: false,
    weekDayDropdownOpenState: false
  };

  componentDidMount() {
    this.handleResetSchedule();

    const { classSchedules } = this.props;
    if (classSchedules) {
      this.setState(() => ({ rows: classSchedules }));
    }
  }

  handleResetSchedule = () => {
    this.setState(() => ({
      schedule: {
        weekDay: '',
        startTime: '00:00',
        endTime: '00:00',
        room: ''
      }
    }));
  };

  handleClickBack = () => {
    const { handleBack } = this.props;
    handleBack();
  };

  handleClickNext = () => {
    const { handleNext, updateClassScheduleInfoForReview } = this.props;
    const { rows } = this.state;
    if (rows.length === 0) openSnackbar('You must at least add one shedule.');
    else {
      updateClassScheduleInfoForReview(rows);
      handleNext();
    }
  };

  handleDropdownClose = props => () => {
    if (props === 'room') this.setState({ roomDropdownOpenState: false });
    else if (props === 'weekDay') this.setState({ weekDayDropdownOpenState: false });
  };

  handleDropdownOpen = props => () => {
    if (props === 'room') this.setState({ roomDropdownOpenState: true });
    else if (props === 'weekDay') this.setState({ weekDayDropdownOpenState: true });
  };

  handleInputChange = prop => e => {
    const { schedule } = this.state;
    let scheduleTemp = { ...schedule };
    scheduleTemp[prop] = e.target.value;
    this.setState(() => ({ schedule: scheduleTemp }));
  };

  handleChangeTime = prop => time => {
    const { schedule } = this.state;
    const scheduleTemp = schedule;
    const fullTime = time.toString().split(' ');
    const realTime = fullTime[4].split(':');
    const needTime = `${realTime[0]}:${realTime[1]}`;
    scheduleTemp[prop] = needTime.toString();
    this.setState({ schedule: scheduleTemp });
  };

  setTableRow = () => {
    const { schedule, rows } = this.state;

    if (schedule.room === '' || schedule.endTime === '' || schedule.startTime === '' || schedule.weekDay === '')
      openSnackbar('You must fill all fields.');
    else {
      const rowTemp = [...rows, schedule];
      this.setState({ rows: rowTemp });
      this.handleResetSchedule();
    }
  };

  deleteTableRow = index => () => {
    const { rows } = this.state;
    const newRow = rows.filter(row => rows.indexOf(row) !== index);
    this.setState({ rows: newRow });
  };

  render() {
    const { schedule, roomDropdownOpenState, weekDayDropdownOpenState, rows } = this.state;
    const { classes, show, parentClasses, roomList } = this.props;

    const Loading = () => (
      <Grid container spacing={24} direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Server is loading...</Typography>
        </Grid>
      </Grid>
    );

    if (show) {
      return (
        <React.Fragment>
          {roomList.length > 0 ? (
            <React.Fragment>
              <Typography variant="h6" gutterBottom>
                Class Schedule Information
              </Typography>
              <form>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl} fullWidth noValidate>
                      <InputLabel htmlFor="room">Room</InputLabel>
                      <Select
                        open={roomDropdownOpenState}
                        onClose={this.handleDropdownClose('room')}
                        onOpen={this.handleDropdownOpen('room')}
                        value={schedule.room}
                        onChange={this.handleInputChange('room')}
                        inputProps={{
                          name: 'room',
                          id: 'room'
                        }}
                      >
                        {roomList.map(room => (
                          <MenuItem key={room.name} value={room.name}>
                            {room.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl} fullWidth noValidate>
                      <InputLabel htmlFor="weekDay">Week Day</InputLabel>
                      <Select
                        open={weekDayDropdownOpenState}
                        onClose={this.handleDropdownClose('weekDay')}
                        onOpen={this.handleDropdownOpen('weekDay')}
                        value={schedule.weekDay}
                        onChange={this.handleInputChange('weekDay')}
                        inputProps={{
                          name: 'weekDay',
                          id: 'weekDay'
                        }}
                      >
                        {weekDay.map(day => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography component="h2" variant="body2">
                      Start Time
                      <TimeInput
                        className={classes.timePicker}
                        mode="24h"
                        onChange={this.handleChangeTime('startTime')}
                        value={moment(schedule.startTime, 'H:mm').toDate()}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography component="h2" variant="body2">
                      End Time
                      <TimeInput
                        className={classes.timePicker}
                        mode="24h"
                        onChange={this.handleChangeTime('endTime')}
                        value={moment(schedule.endTime, 'H:mm').toDate()}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={this.setTableRow}>
                      Add Schedule
                    </Button>
                  </Grid>
                  <Grid item xs={12} className={classes.table}>
                    <Divider />
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Week Day</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>End Time</TableCell>
                          <TableCell>Room</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.weekDay}>
                            <TableCell>{row.weekDay}</TableCell>
                            <TableCell>{row.startTime}</TableCell>
                            <TableCell>{row.endTime}</TableCell>
                            <TableCell>{row.room}</TableCell>
                            <TableCell>
                              <Button onClick={this.deleteTableRow(rows.indexOf(row))}>
                                <Delete color="action" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </form>
            </React.Fragment>
          ) : (
            <Loading />
          )}
          <div className={parentClasses.buttons}>
            <Button variant="contained" color="primary" onClick={this.handleClickNext} className={parentClasses.button}>
              Next
            </Button>
            <Button variant="text" color="primary" onClick={this.handleClickBack} className={parentClasses.button}>
              Back
            </Button>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }
}

ClassScheduleForm.defaultProps = {
  classSchedules: null
};

ClassScheduleForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  parentClasses: PropTypes.shape({}).isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  updateClassScheduleInfoForReview: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  classSchedules: PropTypes.arrayOf(PropTypes.any),
  roomList: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default withStyles(styles)(ClassScheduleForm);
