import React from 'react';
import { connect } from 'react-redux';
import { registerUser } from 'Services/authentication/actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormValidator from 'Utils/FormValidator';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LinearProgress from '@material-ui/core/LinearProgress';
import Code from '@material-ui/icons/Code';

import { APP_LINKS } from 'Config/routers/appLinks';


const styles = theme => ({
  root: {
    zIndex: 2
  },
  form: {
    display: 'flex',
    marginTop: `${theme.spacing.unit * 0.3 + 0.5}rem`,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 100
  },
  input: {
    marginBottom: `${theme.spacing.unit * 0.1}rem`
  },
  action: {
    alignItems: 'center',
    display: 'flex',
    marginTop: `${theme.spacing.unit * 0.1}rem`,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    textTransform: 'none',
    marginBottom: `${theme.spacing.unit * 0.08}rem`,
    width: '50%'
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

class RegisterForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'email',
      method: 'isEmpty',
      validWhen: false,
      message: 'Email field is required.'
    },
    {
      field: 'password',
      method: 'isEmpty',
      validWhen: false,
      message: 'Password field is required.'
    },
    {
      field: 'confirmPassword',
      method: 'isEmpty',
      validWhen: false,
      message: 'Confirm password field is required.'
    },
    {
      field: 'code',
      method: 'isEmpty',
      validWhen: false,
      message: 'Registration code field is required.'
    }
  ]);

  state = {
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    showPassword: false,
    showPasswordConfirm: false,
    isLoading: false,
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    errors: {},
    serverErrors: {}
  };

  componentDidUpdate() {
    const { auth, history } = this.props;
    if (auth.isAuthenticated) {
      history.push(APP_LINKS.DASHBOARD);
    }
  }

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  handleChange = prop => e => {
    this.setState({ [prop]: e.target.value });
  };

  handleMouseDownPassword = e => {
    e.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleClickShowPasswordConfirm = () => {
    this.setState(state => ({ showPasswordConfirm: !state.showPasswordConfirm }));
  };

  handleReset = () => {
    this.setState(() => ({
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {},
      errors: {}
    }));
  };

  handleSubmit = e => {
    const {isLoading} = this.state;
    e.preventDefault();
    this.triggerLoadingState();
    console.log(isLoading)

    const clientSideValidation = this.validator.validate(this.state);
    this.setState(() => ({
      clientSideValidation,
      hasEverSubmitted: true,
      errors: {}
    }));

    const { email, password, confirmPassword, code } = this.state;
    const {dispatchRegisterUser} = this.props;

    if (clientSideValidation.isValid) {
      if (confirmPassword !== password) {
        this.setState(() => ({
          errors: {
            confirmPassword: 'Confirm password is incorrect'
          }
        }))
      } else {
        const userData = {
          email,
          password,
          code
        };

        
        console.log(isLoading)

        dispatchRegisterUser(userData);

        // try {
        //   const response = await axios.post(`api/auth/register`, userData);
        //   this.turnOffLoadingState();
        //   this.handleReset();
        //   console.log(response);
        // } catch (err) {
        //   console.log(err);
        // }
      }
    }

    this.turnOffLoadingState();
  };

  render() {
    const {
      email,
      password,
      confirmPassword,
      code,
      showPassword,
      showPasswordConfirm,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors,
      errors
    } = this.state;
    const { classes } = this.props;

    let validation = hasEverSubmitted ? this.validator.validate(this.state) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        {isLoading && <Loading />}
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <FormControl error={!!serverErrors.email || validation.email.isInvalid} className={classes.input}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              value={email}
              onChange={this.handleChange('email')}
              disabled={isLoading}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
            <FormHelperText id="email-error-text">
              {serverErrors.email || '' || validation.email.message}
            </FormHelperText>
          </FormControl>
          <FormControl error={validation.password.isInvalid} className={classes.input}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={this.handleChange('password')}
              disabled={isLoading}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="password-error-text">
              {'' || validation.password.message}
            </FormHelperText>
          </FormControl>
          <FormControl error={!!errors.confirmPassword || validation.confirmPassword.isInvalid} className={classes.input}>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <Input
              id="confirmPassword"
              type={showPasswordConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={this.handleChange('confirmPassword')}
              disabled={isLoading}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPasswordConfirm}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="confirmPassword-error-text">
              {errors.confirmPassword || '' || validation.confirmPassword.message}
            </FormHelperText>
          </FormControl>
          <FormControl error={!!serverErrors.code || validation.code.isInvalid} className={classes.input}>
            <InputLabel htmlFor="code">Registration Code</InputLabel>
            <Input
              id="code"
              value={code}
              onChange={this.handleChange('code')}
              disabled={isLoading}
              startAdornment={
                <InputAdornment position="start">
                  <Code />
                </InputAdornment>
              }
            />
            <FormHelperText id="code-error-text">
              {serverErrors.code || '' || validation.code.message}
            </FormHelperText>
          </FormControl>
          <div className={classes.action}>
            <Button type="submit" className={classes.button} variant="raised" color="primary" disabled={isLoading}>
              Register
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  dispatchRegisterUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = dispatch => ({
  dispatchRegisterUser: userData => dispatch(registerUser(userData))
});

const StyledRegisterForm = withStyles(styles)(RegisterForm);

export { RegisterForm, StyledRegisterForm };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledRegisterForm);
