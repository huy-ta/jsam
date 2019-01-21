import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';
import PaperLoading from 'GlobalComponents/PaperLoading';
import { APP_LINKS } from 'Config/routers/appLinks';

const styles = theme => ({
  root: {},
  textField: {},
  formControl: {},
  group: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  }
});

const defaultInput = () => ({
  name: '',
  school: '',
  phone: {
    self: '',
    parent: ''
  },
  gender: '',
  status: ''
});

class AddStudentForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Student name is required.'
    },
    {
      field: 'gender',
      method: 'isEmpty',
      validWhen: false,
      message: 'Gender is required.'
    }
  ]);

  state = {
    input: defaultInput(),
    statusDropdownOpenState: false,
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {},
    showSuccessMessage: false
  };

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpenState: true });
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  // FIXME: Needs refactoring
  handleSelfPhoneNumberInputChange = e => {
    const { value } = e.target;
    if (!value.match(/^[0-9]{0,10}$/)) return;

    const { input } = this.state;
    const inputTemp = input;
    inputTemp.phone.self = value;
    this.setState(() => ({ input: inputTemp }));
  };

  handleParentPhoneNumberInputChange = e => {
    const { value } = e.target;
    if (!value.match(/^[0-9]{0,10}$/)) return;

    const { input } = this.state;
    const inputTemp = input;
    inputTemp.phone.parent = value;
    this.setState(() => ({ input: inputTemp }));
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.triggerLoadingState();

    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input } = this.state;
      try {
        await axios.post('/api/students', input);
        this.handleReset();
        this.setState(() => ({ showSuccessMessage: true }));
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
    const { classes, statusList } = this.props;
    const { input, statusDropdownOpenState, hasEverSubmitted, clientSideValidation, isLoading, serverErrors, showSuccessMessage } = this.state;

    let validation = hasEverSubmitted ? this.validator.validate(input) : clientSideValidation;

    const SuccessMessage = () => (
      <React.Fragment>
        <Typography variant="body1">
          The student has been successfully added. You can continue to create a new student or go to the Find Student page.
        </Typography>
        <Link to={APP_LINKS.FIND_STUDENT} style={{ textDecoration: 'none' }}>
          <Button className={classes.button} variant="contained" type="button" color="primary">
            GO TO FIND STUDENT PAGE
          </Button>
        </Link>
        <Button
          className={classes.button}
          variant="text"
          type="button"
          color="primary"
          onClick={() => this.setState(() => ({ showSuccessMessage: false }))}
        >
          CONTINUE TO ADD STUDENT
        </Button>
      </React.Fragment>
    );

    if (showSuccessMessage) {
      return <SuccessMessage />;
    }

    return (
      <React.Fragment>
        {isLoading && <PaperLoading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid spacing={24} container>
            <Grid item xs={12} lg={6}>
              <TextField
                id="student-name"
                label="Student Name"
                className={classes.textField}
                value={input.name}
                onChange={this.handleInputChange('name')}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || '' || validation.name.message}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="school"
                label="School"
                className={classes.textField}
                value={input.school}
                error={!!serverErrors.school}
                helperText={serverErrors.school || ''}
                onChange={this.handleInputChange('school')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="phone-self"
                label="Self Phone Number"
                className={classes.textField}
                value={input.phone.self}
                onChange={this.handleSelfPhoneNumberInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="phone-parent"
                label="Parent Phone Number"
                className={classes.textField}
                value={input.phone.parent}
                onChange={this.handleParentPhoneNumberInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                  open={statusDropdownOpenState}
                  onClose={this.handleStatusDropdownClose}
                  onOpen={this.handleStatusDropdownOpen}
                  value={input.status}
                  onChange={this.handleInputChange('status')}
                  inputProps={{
                    name: 'status',
                    id: 'status'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {statusList.map(status => (
                    <MenuItem key={status._id} value={status._id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset" className={classes.formControl} error={!!serverErrors.gender || validation.gender.isInvalid}>
                <Grid container justify="space-between" alignItems="center" spacing={24}>
                  <Grid item>
                    <FormLabel component="legend" labelplacement="left">
                      Gender
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <RadioGroup
                      id="gender"
                      aria-label="Gender"
                      className={classes.group}
                      value={input.gender}
                      onChange={this.handleInputChange('gender')}
                    >
                      <FormControlLabel value="male" control={<Radio color="primary" />} label="Male" />
                      <FormControlLabel value="female" control={<Radio color="primary" />} label="Female" />
                    </RadioGroup>
                  </Grid>
                </Grid>
                <FormHelperText style={{ 'margin-top': 0 }}>{serverErrors.gender || '' || validation.gender.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={isLoading}>
                Add Student
              </Button>
              <Button type="reset" className={classes.button} variant="text" color="primary" onClick={this.handleReset} disabled={isLoading}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    );
  }
}

AddStudentForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  statusList: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default withStyles(styles)(AddStudentForm);
