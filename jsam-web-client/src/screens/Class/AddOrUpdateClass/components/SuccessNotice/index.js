import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { APP_LINKS } from 'Config/routers/appLinks';

const SuccessNotice = props => {
  const { parentClasses, handleReset, mode } = props;

  return (
    <React.Fragment>
      {mode === 'add' ? (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Successfully added class.
          </Typography>
          <Typography variant="subtitle1">
            You can go to the &quot;Find Class&quot; page or continue add new class.
          </Typography>
          <div className={parentClasses.buttons}>
            <Link to={APP_LINKS.FIND_CLASS} style={{ textDecoration: 'none' }}>
              <Button className={parentClasses.button} variant="contained" type="button" color="primary">
                GO TO FIND CLASS PAGE
              </Button>
            </Link>
            <Link to={APP_LINKS.ADD_CLASS} style={{ textDecoration: 'none' }}>
              <Button variant="text" color="primary" onClick={handleReset} className={parentClasses.button}>
                CONTINUE TO ADD CLASS
              </Button>
            </Link>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Successfully edited class.
          </Typography>
          <Typography variant="subtitle1">You can now close this dialog.</Typography>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

SuccessNotice.propTypes = {
  parentClasses: PropTypes.shape({}).isRequired,
  handleReset: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired
};

export default withRouter(SuccessNotice);
