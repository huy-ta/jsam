import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { openSnackbar } from 'GlobalComponents/Notification';

import { updateSessionSummaryOnServerById } from 'Services/sessions/actions';
import axios from 'axios';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative'
  },
  listItem: {
    padding: `${theme.spacing.unit * 0.5}px 0`
  },
  listItemText: {
    width: 'auto'
  }
});

class PhaseInfo extends React.Component {
  state = {
    session: {},
    input: {
      homework: '',
      note: ''
    },
    open: false
  };

  async componentDidMount() {
    const response = await axios.get('/api/study-sessions/5c14c5412ac6a408d9716190/summary');
    this.setState({ session: response.data.details });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleReset = () => {
    const input = {
      homework: '',
      note: ''
    };
    this.setState({ input });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { input } = this.state;
    if (input.homework === '' || input.note === '') openSnackbar('You must fill all fields');
    else {
      const { dispatchUpdateSessionSummaryOnServerById } = this.props;
      await dispatchUpdateSessionSummaryOnServerById('5c14c5412ac6a408d9716190', input);
    }
  };

  handleChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  render() {
    const { classes, show } = this.props;
    const { session, open, input } = this.state;

    if (show) {
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Session Summary
          </Button>
          <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            {session.homework === undefined || session.homework === '' ? (
              <React.Fragment>
                <DialogTitle id="form-dialog-title">Assigment</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You must fill homework and note fields before view the session summary
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Homework"
                    value={input.homework}
                    onChange={this.handleChange('homework')}
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Note"
                    value={input.note}
                    onChange={this.handleChange('note')}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleSubmit} color="primary">
                    Ok
                  </Button>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <DialogTitle id="form-dialog-title">Session Summary</DialogTitle>
                <DialogContent>
                  <Typography variant="h6" gutterBottom>
                    {session.name}
                  </Typography>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom fullWidth>
                        Assigment
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item xs={6}>
                      <List disablePadding fullWidth>
                        <ListItem className={classes.listItem}>
                          <ListItemText
                            className={classes.listItemText}
                            primary="Homework"
                            secondary={session.homework}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <List disablePadding fullWidth>
                        <ListItem className={classes.listItem}>
                          <ListItemText className={classes.listItemText} primary="Note" secondary={session.note} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                      <Typography variant="h6" gutterBottom fullWidth>
                        Faults
                      </Typography>
                    </Grid>
                    {session.fault.map(studentFault => (
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom fullWidth>
                          {studentFault.name}
                        </Typography>
                        <List disablePadding>
                          <ListItem className={classes.listItem} fullWidth>
                            {' '}
                            {studentFault.students.map(student => (
                              <ListItemText className={classes.listItemText} secondary={student} fullWidth />
                            ))}
                          </ListItem>
                        </List>
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </React.Fragment>
            )}
          </Dialog>
        </div>
      );
    }
    return null;
  }
}

PhaseInfo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  dispatchUpdateSessionSummaryOnServerById: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateSessionSummaryOnServerById: (_id, sessionUpdateData) =>
    dispatch(updateSessionSummaryOnServerById(_id, sessionUpdateData))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(PhaseInfo));
