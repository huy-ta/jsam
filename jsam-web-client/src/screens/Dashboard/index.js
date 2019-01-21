/* eslint react/prop-types: 0 */

import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';

import jSamLogo from 'Assets/images/jSamLogo.svg';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center'
  }
});

const Dashboard = props => {
  const { classes } = props;

  return (
    <Section header="Overview" subheader="Dashboard">
      <Paper className={classes.root}>
        <Typography variant="h3">Welcome to jSam</Typography>
        <Typography variant="body2">Student Management System</Typography>
        <img src={jSamLogo} alt="jSam Logo" width="35%" />
      </Paper>
    </Section>
  );
};

export default withStyles(styles)(Dashboard);
