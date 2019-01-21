import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from "@material-ui/core/LinearProgress";

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from "GlobalComponents/Notification";

const styles = theme => ({
  textfield: {
    marginTop: theme.spacing.unit * 0.2
  },
  button: {
    marginTop: theme.spacing.unit * 0.2,
    marginRight: theme.spacing.unit * 0.2
  },
  suggestion: {
    zIndex: 3
  },
  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 3
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  }
});

const defaultInput = () => ({
  name: '',
  floor: '',
  capacity: ''
});

class AddRoomForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Room name is required.'
    },
    {
      field: 'floor',
      method: 'isEmpty',
      validWhen: false,
      message: 'Floor is required.'
    }
  ]);

  state = {
    input: defaultInput(),
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {}
  }

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputItem = input;
    inputItem[prop] = e.target.value;
    this.setState({ input: inputItem });
  }

  handleReset = () => {
    this.setState({
      input: defaultInput(),
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {}
    });
  }

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.triggerLoadingState();

    this.setState({ hasEverSubmitted: true });

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input } = this.state;
      try {
        await axios.post('/api/rooms', input);
        this.handleReset();
        openSnackbar('Successfully added room.');
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

  render() {
    const { classes } = this.props;
    const { input, hasEverSubmitted, clientSideValidation, isLoading, serverErrors } = this.state;

    let validation = hasEverSubmitted ? this.validator.validate(input) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12} lg={4} >
              <TextField
                id="room-name"
                label="Room Name"
                value={input.name}
                onChange={this.handleInputChange("name")}
                className={classes.textfield}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || '' || validation.name.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4} >
              <TextField
                id="floor"
                label="Floor"
                value={input.floor}
                onChange={this.handleInputChange("floor")}
                className={classes.textfield}
                error={!!serverErrors.floor || validation.floor.isInvalid}
                helperText={serverErrors.floor || '' || validation.floor.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4} >
              <TextField
                id="capacity"
                label="capacity"
                value={input.capacity}
                onChange={this.handleInputChange("capacity")}
                className={classes.textfield}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Button
                type="submit"
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                Create Room
              </Button>
              <Button
                type="reset"
                className={classes.button}
                variant="text"
                color="primary"
                onClick={this.handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    )
  }
}

AddRoomForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddRoomForm);