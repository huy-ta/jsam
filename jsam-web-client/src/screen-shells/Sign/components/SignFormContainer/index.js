import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import jSamLogo from 'Assets/images/jSamLogo.svg';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    position: 'relative',
    zIndex: 2,
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 2
  },
  logoContainer: {
    alignItems: 'flex-start',
    borderRadius: '50%',
    position: 'absolute',
    width: `${theme.spacing.unit * 1.5}rem`,
    height: `${theme.spacing.unit * 1.5}rem`,
    minWidth: '20rem',
    maxWidth: '30rem',
    minHeight: '20rem',
    maxHeight: '30rem',
    backgroundColor: 'white',
    display: 'flex',
    left: '0',
    right: '0',
    margin: 'auto',
    marginTop: `-${theme.spacing.unit / 2}rem`,
    justifyContent: 'center',
    zIndex: 1
  },
  formContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '45%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: `
      ${theme.spacing.unit * 3}px 
      ${theme.spacing.unit * 3}px 
      ${theme.spacing.unit}px 
      ${theme.spacing.unit * 3}px
    `,
    overflow: 'hidden'
  },
  loading: {
    backgroundColor: theme.palette.grey['50'],
    pointerEvents: 'none'
  },
  loadingLogo: {
    opacity: '0.4'
  }
});

class SignFormContainer extends React.Component {
  state = {
    isLoading: false
  };

  toggleLoading = isLoading => {
    this.setState(() => ({ isLoading }));
  };

  render() {
    const { isLoading } = this.state;
    const { classes, children } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { toggleLoading: this.toggleLoading })
    );

    return (
      <Grid container justify="center" alignItems="center" className={classes.root}>
        <Grid item xs={10} lg={6} xl={5}>
          <Paper
            className={isLoading ? classNames(classes.logoContainer, classes.loading) : classes.logoContainer}
            elevation={0}
          >
            <img className={isLoading ? classes.loadingLogo : ''} src={jSamLogo} width="65%" alt="jSam Logo" />
          </Paper>
          <Paper
            className={isLoading ? classNames(classes.formContainer, classes.loading) : classes.formContainer}
            elevation={1}
          >
            {childrenWithProps}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

SignFormContainer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired
};

const StyledSignFormContainer = withStyles(styles)(SignFormContainer);

export { StyledSignFormContainer };

export default StyledSignFormContainer;
