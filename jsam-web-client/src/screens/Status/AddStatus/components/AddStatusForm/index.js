import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';
import { APP_LINKS } from 'Config/routers/appLinks';

const styles = theme => ({
  root: {},
  textField: {},
  formControl: {},
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  },
  progress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 3
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  }
});

const defaultInput = () => ({
  name: '',
  description: ''
});

class AddStatusForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Status name is required.'
    }
  ]);

  state = {
    input: defaultInput(),
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {},
    successMessageOn: false
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  // FIXME: Needs refactoring

  turnOnLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  turnOnSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: true }));
  };

  turnOffSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.turnOnLoadingState();
    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input } = this.state;
      try {
        await axios.post('/api/status', input);
        this.handleReset();
        this.turnOnSuccessMessage();
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar("The server isn't responding at the moment. Please try again later.");
        } else {
          this.setState(() => ({ serverErrors: response.data.errors }));
        }
      }
    }
    this.turnOffLoadingState();
  };

  handleReset = () => {
    this.setState(() => ({
      input: defaultInput(),
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {}
    }));
  };

  render() {
    const { classes } = this.props;
    const { input, hasEverSubmitted, clientSideValidation, isLoading, serverErrors, successMessageOn } = this.state;

    let validation = hasEverSubmitted ? this.validator.validate(input) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    let SuccessMessage;
    if (successMessageOn) {
      SuccessMessage = () => (
        <React.Fragment>
          <Typography variant="body1">
            The status has been successfully created. You can continue to create a new status or go to the Find Status page.
          </Typography>
          <Link to={APP_LINKS.FIND_STATUS} style={{ textDecoration: 'none' }}>
            <Button className={classes.button} variant="contained" type="button" color="primary">
              GO TO FIND STATUS PAGE
            </Button>
          </Link>

          <Button className={classes.button} variant="text" type="button" color="primary" onClick={this.turnOffSuccessMessage}>
            CONTINUE TO ADD STATUS
          </Button>
        </React.Fragment>
      );
    }

    const addStatusForm = (
      <React.Fragment>
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid spacing={24} container>
            <Grid item xs={12}>
              <TextField
                id="status-name"
                label="Status Name"
                className={classes.textField}
                value={input.name}
                onChange={this.handleInputChange('name')}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || '' || validation.name.message}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="Description"
                className={classes.textField}
                value={input.description}
                error={!!serverErrors.description}
                helperText={serverErrors.description || ''}
                onChange={this.handleInputChange('description')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={isLoading}>
                Add Status
              </Button>
              <Button type="reset" className={classes.button} variant="text" color="primary" onClick={this.handleReset} disabled={isLoading}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {!successMessageOn && addStatusForm}
        {successMessageOn && <SuccessMessage />}
      </React.Fragment>
    );
  }
}

AddStatusForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddStatusForm);
