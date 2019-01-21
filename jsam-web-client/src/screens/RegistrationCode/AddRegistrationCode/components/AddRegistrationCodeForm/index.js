import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import startCase from 'lodash/startCase';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';

import FileCopy from '@material-ui/icons/FileCopy';

import { validateFieldByOneRule } from 'Utils/validateField';
import PaperLoading from 'GlobalComponents/PaperLoading';
import useRegexTextFieldInput from 'Hooks/useRegexTextFieldInput';
import useDropdownInput from 'Hooks/useDropdownInput';
import { openSnackbar } from 'GlobalComponents/Notification';
import { APP_LINKS } from 'Config/routers/appLinks';
import { UserType } from 'Config/enums/UserTypeEnum';

const userTypes = [UserType.TEACHER, UserType.TEACHING_ASSISTANT];

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
  },
  codeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit * 1.6}px`,
    background: theme.palette.grey[200],
    borderLeft: `${theme.spacing.unit * 0.6}px solid ${theme.palette.primary.main}`,
    marginTop: theme.spacing.unit * 0.8,
    marginBottom: theme.spacing.unit * 0.8
  }
});

const AddRegistrationCodeForm = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEverSubmitted, setIsEverSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [registrationCode, setRegistrationCode] = useState('');

  const userTypeValidationRule = { method: 'isEmpty', message: 'User type is required.', validWhen: false };
  let userTypeClientError = '';
  const userTypeInput = useDropdownInput('');

  const validPeriodInput = useRegexTextFieldInput('', /^[0-9]{0,2}$/);

  const handleReset = () => {
    setIsEverSubmitted(false);
  };

  const performClientSideValidation = () => {
    userTypeClientError = validateFieldByOneRule(userTypeInput.value, userTypeValidationRule);
    return !userTypeClientError;
  };

  if (isEverSubmitted) {
    performClientSideValidation();
  }

  const handleSubmit = async e => {
    e.preventDefault();

    setIsLoading(true);
    setIsEverSubmitted(true);

    const isClientValid = performClientSideValidation();
    if (isClientValid) {
      try {
        const codeInfo = {
          userType: userTypeInput.value,
          validPeriod: validPeriodInput.value * 2592000000
        };

        const response = await axios.post('/api/registration-codes', codeInfo);

        setRegistrationCode(response.data.details.registrationCode);

        handleReset();
        setShowSuccessMessage(true);
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar("The server isn't responding at the moment. Please try again later.");
        } else {
          setServerErrors(response.data.errors);
        }
      }
    }

    setIsLoading(false);
  };

  const { classes } = props;

  const SuccessMessage = () => (
    <React.Fragment>
      <Typography variant="body1">
        The registration code has been successfully created. After copying the following registration code, you can continue to create a new role or
        go to the Find Registration Code page.
      </Typography>
      <Grid container justify="center" alignItems="center" direction="row">
        <Grid item className={classes.codeContainer}>
          <Typography variant="h5">{registrationCode}</Typography>
          <Tooltip title="Copy to clipboard">
            <CopyToClipboard text={registrationCode}>
              <IconButton>
                <FileCopy />
              </IconButton>
            </CopyToClipboard>
          </Tooltip>
        </Grid>
      </Grid>
      <Link to={APP_LINKS.FIND_REGISTRATION_CODE} style={{ textDecoration: 'none' }}>
        <Button className={classes.button} variant="contained" type="button" color="primary">
          GO TO FIND REGISTRATION CODE PAGE
        </Button>
      </Link>
      <Button
        className={classes.button}
        variant="text"
        type="button"
        color="primary"
        onClick={() => {
          setShowSuccessMessage(false);
        }}
      >
        CONTINUE TO ADD REGISTRATION CODE
      </Button>
    </React.Fragment>
  );

  if (!showSuccessMessage) {
    return (
      <React.Fragment>
        {isLoading && <PaperLoading />}
        <form className={classes.root} onSubmit={handleSubmit}>
          <Grid spacing={24} container>
            <Grid item xs={6} lg={4}>
              <FormControl className={classes.formControl} required error={!!userTypeClientError || !!serverErrors.userType} fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select {...userTypeInput}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {userTypes.map(userType => (
                    <MenuItem key={userType} value={userType}>
                      {startCase(userType)}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{userTypeClientError || '' || serverErrors.userType}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4} lg={3}>
              <TextField
                label="Valid Period"
                className={classes.textField}
                {...validPeriodInput}
                error={!!serverErrors.validPeriod}
                helperText={serverErrors.validPeriod}
                InputProps={{
                  endAdornment: <InputAdornment position="end">months</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" disabled={isLoading}>
                Add Registration Code
              </Button>
              <Button type="reset" className={classes.button} variant="text" color="primary" disabled={isLoading}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    );
  }

  return <SuccessMessage />;
};

AddRegistrationCodeForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddRegistrationCodeForm);
