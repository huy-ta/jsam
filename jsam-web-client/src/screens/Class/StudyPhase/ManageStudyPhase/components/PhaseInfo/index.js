import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { InlineDatePicker } from 'material-ui-pickers';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative'
  }
});

const PhaseInfo = props => {
  const { classes, phase, show } = props;
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(null);
  const [phaseFee, setPhaseFee] = useState('');

  useEffect(
    () => {
      if (phase.startDate) {
        setStartDate(moment(Date.parse(phase.startDate)));
      }
      if (phase.endDate) {
        setEndDate(moment(Date.parse(phase.endDate)));
      }
      if (phase.phaseFee) {
        setPhaseFee(phase.phaseFee);
      }
    },
    [show, phase]
  );

  const handleStartDateChange = async date => {
    setStartDate(date);
    try {
      await axios.put(`/api/study-phases/${phase._id}`, {
        startDate: date.toDate()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndDateChange = async date => {
    setEndDate(date);
    try {
      await axios.put(`/api/study-phases/${phase._id}`, {
        endDate: date.toDate()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhaseFeeChange = async e => {
    const { value: newValue } = e.target;
    if (/^[-+]?(?:[0-9]+,)*[0-9]+$/.test(newValue)) {
      setPhaseFee(newValue);
      if (newValue.length > 6 || newValue.length === 0) {
        await axios.put(`/api/study-phases/${phase._id}`, {
          phaseFee: parseInt(newValue.replace(',', ''), 10)
        });
      }
    }
  };

  if (show) {
    return (
      <Paper className={classes.root}>
        <Typography variant="h6">Study Phase Info</Typography>
        <Grid container spacing={24}>
          <Grid item>
            <InlineDatePicker
              keyboard
              format="DD/MM/YYYY"
              label="Start date"
              value={startDate}
              onChange={handleStartDateChange}
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              fullWidth
            />
          </Grid>
          <Grid item>
            <InlineDatePicker
              keyboard
              format="DD/MM/YYYY"
              label="End date"
              value={endDate}
              onChange={handleEndDateChange}
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label="Phase fee"
              value={phaseFee}
              onChange={handlePhaseFeeChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">VND</InputAdornment>
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
  return null;
};

PhaseInfo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired,
  show: PropTypes.bool.isRequired
};

export default withStyles(styles)(PhaseInfo);
