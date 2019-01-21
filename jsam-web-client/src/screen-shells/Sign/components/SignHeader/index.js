import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { APP_LINKS } from 'Config/routers/appLinks';

const styles = ({ spacing, palette }) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: 1,
    margin: spacing.unit
  },
  text: {
    color: palette.primary.contrastText
  },
  headline: {},
  subheading: {}
});

const SignHeader = props => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography className={classNames(classes.text, classes.headline)} variant="headline" gutterBottom>
        Let jSam help you to get everything under control!
      </Typography>
      <Typography className={classNames(classes.text, classes.subheading)} variant="subheading" gutterBottom>
        But first you need to{' '}
        <Link to={APP_LINKS.LOGIN} style={{ textDecoration: 'none', color: 'white', fontWeight: '500' }}>
          login
        </Link>
        {' or '}
        <Link to={APP_LINKS.REGISTER} style={{ textDecoration: 'none', color: 'white', fontWeight: '500' }}>
          create an account
        </Link>{' '}
        if not registered yet
      </Typography>
    </div>
  );
};

SignHeader.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

const StyledSignHeader = withStyles(styles)(SignHeader);

export { StyledSignHeader };

export default StyledSignHeader;
