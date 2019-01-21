import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    width: '100%'
  },
  toolbar: theme.mixins.toolbar,
  topMargin: {
    marginTop: theme.spacing.unit * 0.2
  },
  header: {
    width: '100%',
    backgroundColor: theme.palette.grey['200'],
    padding: theme.spacing.unit * 0.45,
    margin: 0
  },
  sectionText: {
    color: theme.palette.grey['500'],
    letterSpacing: '-1px'
  },
  verticalDivider: {
    color: theme.palette.grey['500'],
    fontWeight: 50
  },
  subSectionText: {
    letterSpacing: '-2px',
    fontWeight: 500
  }
});

const SectionHeader = props => {
  const { classes, header, subheader } = props;

  return (
    <div className={classes.root}>
      <div className={classnames(classes.toolbar, classes.topMargin)} />
      <Grid container className={classes.header} alignItems="center" justify="flex-start" direction="row" spacing={24}>
        <Grid item>
          <Typography variant="h4" className={classes.sectionText}>
            {header}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4" className={classes.verticalDivider}>
            |
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" className={classes.subSectionText}>
            {subheader}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

SectionHeader.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired
};

const StyledSectionHeader = withStyles(styles)(SectionHeader);

export default StyledSectionHeader;
