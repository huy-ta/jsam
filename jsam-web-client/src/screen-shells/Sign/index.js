import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SignBackground from 'Assets/images/SignBackground.png';

import SignHeader from './components/SignHeader';
import SignFormContainer from './components/SignFormContainer';

const styles = theme => ({
  root: {
    alignItems: 'center',
    background: `linear-gradient(to left, ${theme.palette.primary.dark},${theme.palette.primary.main})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    overflowX: 'hidden'
  },
  background: {
    background: `url('${SignBackground}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'fixed',
    opacity: '0.1',
    width: '100%',
    minHeight: '100vh',
    zIndex: 0
  }
});

export const Sign = props => {
  const { classes, children } = props;
  const { background, root } = classes;

  return (
    <div>
      <div className={background} />
      <div className={root}>
        <SignHeader />
        <SignFormContainer>{children}</SignFormContainer>
      </div>
    </div>
  );
};

Sign.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired
};

const StyledSign = withStyles(styles)(Sign);

export { StyledSign };

export default StyledSign;
