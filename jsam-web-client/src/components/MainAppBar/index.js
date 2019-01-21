import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import Menu from '@material-ui/icons/Menu';

import { logoutUser } from 'Services/authentication/actions';

import jSamLogoHexagonWrapper from 'Assets/images/hexagon.svg';

import { openSidebar } from '../Sidebar';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary,
    width: '100%',
    marginLeft: 0,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${theme.spacing.drawerWidth.mdUp}px)`,
      marginLeft: theme.spacing.drawerWidth.mdUp
    },
    [theme.breakpoints.up('xl')]: {
      width: `calc(100% - ${theme.spacing.drawerWidth.xlUp}px)`,
      marginLeft: theme.spacing.drawerWidth.xlUp
    },
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    minHeight: '48px'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.15)
    },
    marginRight: theme.spacing.unit,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 5,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit / 2,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit * 5,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: 500
    }
  },
  dialog: {
    overflow: 'hidden'
  },
  dialogContent: {
    overflow: 'hidden'
  },
  logoutGrid: {
    paddingBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit / 2
  }
});

class MainAppBar extends React.Component {
  state = {
    isLogoutDialogOpen: false,
    isAccountDialogOpen: false,
    input: {}
  };

  isMounted = false;

  componentWillMount = async () => {
    this.isMounted = true;
    const { auth } = this.props;
    const { input } = this.state;
    if (auth.user.userType === "teaching assistant") {
      try {
        const response = await axios.get(`/api/teaching-assistants/email/${auth.user.email}`, {
          timeout: 10000
        });
        if (this.isMounted) {
          const account = response.data.details;
          let tempInput = input;
          tempInput.name = account.name;
          tempInput.facebook = account.facebook;
          tempInput.phone = account.phone;
          tempInput.dateOfBirth = account.dateOfBirth;
          tempInput.gender = account.gender;
          this.setState(() => ({ input: tempInput }));
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (auth.user.userType === "teacher") {
      try {
        const response = await axios.get(`/api/teachers/email/${auth.user.email}`, {
          timeout: 10000
        });
        if (this.isMounted) {
          const account = response.data.details;
          let tempInput = input;
          tempInput.name = account.name;
          tempInput.facebook = account.facebook;
          tempInput.phone = account.phone;
          tempInput.dateOfBirth = account.dateOfBirth;
          tempInput.gender = account.gender;
          this.setState(() => ({ input: tempInput }));
        }
      } catch (err) {
        console.log(err)
      }

    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleClickLogout = () => {
    this.setState({ isLogoutDialogOpen: true });
  };

  handleLogout = () => {
    const { logoutUser: dispatchLogoutUser } = this.props;
    dispatchLogoutUser();
  };

  handleClose = () => {
    this.setState({ isLogoutDialogOpen: false });
  };

  handleClickAccount = () => {
    this.setState({ isAccountDialogOpen: true });
  }

  handleChangeAccount = async e => {
    e.preventDefault();
    const { input } = this.state;
    const { auth } = this.props;
    try {
      if (auth.user.userType === "teaching assistant") {
        await axios.put(`/api/teaching-assistants/email/${auth.user.email}`, input);
      }
      if (auth.user.userType === "teacher") {
        await axios.put(`/api/teachers/email/${auth.user.email}`, input);
      }
      openSidebar("Update successfully");
      this.handleCloseAccount();
    } catch (err) {
      console.log(err);
    }
  }

  handleCloseAccount = () => {
    this.setState({ isAccountDialogOpen: false });
  }

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  handlePhoneNumberInputChange = e => {
    const { value } = e.target;
    if (!value.match(/^[0-9]{0,10}$/)) return;

    const { input } = this.state;
    const inputTemp = input;
    inputTemp.phone = value;
    this.setState(() => ({ input: inputTemp }));
  };

  render() {
    const { isLogoutDialogOpen, isAccountDialogOpen, input } = this.state;
    const { classes, auth } = this.props;
    console.log(auth);
    console.log(input);

    const LogoutDialog = () => (
      <Dialog open={isLogoutDialogOpen} onClose={this.handleClose} className={classes.dialog}>
        <DialogTitle>{'Confirm to log out'}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialog}>
          <Grid container justify="flex-start" spacing={16} className={classes.logoutGrid}>
            <Grid item>
              <Button variant="contained" onClick={this.handleLogout} color="primary">
                Log out
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Stay
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );

    const AccountDialog = (
      <Dialog
        open={isAccountDialogOpen}
        onClose={this.handleCloseAccount}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Change Infomation</DialogTitle>
        <DialogContent>
          <Grid spacing={24} container>
            <Grid item xs={12}>
              <TextField
                autoFocus
                id="name"
                label="Name"
                className={classes.textField}
                value={input.name}
                onChange={this.handleInputChange('name')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                label="Email"
                className={classes.textField}
                value={auth.user.email}
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="facebook"
                label="Facebook"
                className={classes.textField}
                value={input.facebook}
                onChange={this.handleInputChange('facebook')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="phone"
                label="Phone Number"
                className={classes.textField}
                value={input.phone}
                onChange={this.handlePhoneNumberInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <form className={classes.container} noValidate>
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  value={input.dateOfBirth}
                  className={classes.textField}
                  onChange={this.handleInputChange("birthday")}
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                />
              </form>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset" className={classes.formControl}>
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
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={this.handleChangeAccount} color="primary">
            Confirm
          </Button>
          <Button onClick={this.handleCloseAccount} color="primary" autoFocus>
            Stay
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <AppBar position="fixed" className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Hidden mdDown>
            <img src={jSamLogoHexagonWrapper} width="42px" alt="jSam Logo" />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
          </Hidden>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              onClick={() => {
                openSidebar();
              }}
            >
              <Menu />
            </IconButton>
          </Hidden>
          <div className={classes.grow} />
          <IconButton color="inherit" onClick={this.handleClickAccount}>
            <AccountCircle />
          </IconButton>
          <IconButton color="inherit" onClick={this.handleClickLogout}>
            <PowerSettingsNew />
          </IconButton>
        </Toolbar>
        <LogoutDialog />
        {AccountDialog}
      </AppBar>
    );
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = dispatch => ({
  logoutUser: userData => dispatch(logoutUser(userData))
});

const StyledAppBar = withStyles(styles)(MainAppBar);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledAppBar);
