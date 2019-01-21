import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit * 0.5}px 0`
  },
  listItemText: {
    width: 'auto'
  },
  progress: {
    position: 'absolute',
    width: '100%',
    left: '0',
    bottom: '0',
    zIndex: 5
  },
  overlay: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: theme.palette.grey[200],
    zIndex: 4,
    opacity: 0.7
  }
});

class ClassInfoReview extends React.Component {
  state = {
    isLoading: false
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  handleClickBack = () => {
    const { handleBack } = this.props;
    handleBack();
  };

  handleSubmitCreateClassForm = async () => {
    this.triggerLoadingState();

    const { submitCreateClassForm } = this.props;
    await submitCreateClassForm();

    this.turnOffLoadingState();
  };

  render() {
    const { classes, show, parentClasses, classBaseInfo, classSchedules, mode } = this.props;
    const { isLoading } = this.state;

    const classFields = [
      { name: 'Course name', value: classBaseInfo.course },
      { name: 'Class name', value: classBaseInfo.name }
    ];

    if (show) {
      return (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Confirmation
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <List disablePadding>
                {classFields.map(field => (
                  <ListItem className={classes.listItem} key={field.name}>
                    <ListItemText className={classes.listItemText} primary={field.name} secondary={field.value} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <List disablePadding>
                {classSchedules.map((classSchedule, index) => (
                  <ListItem className={classes.listItem} key={classSchedule.weekDay}>
                    <ListItemText
                      className={classes.listItemText}
                      primary={`Schedule ${index + 1}`}
                      secondary={`${classSchedule.weekDay} from ${classSchedule.startTime} to ${
                        classSchedule.endTime
                      } in ${classSchedule.room}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          <div className={parentClasses.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmitCreateClassForm}
              className={parentClasses.button}
            >
              {mode === 'add' ? 'Add Class' : 'Edit Class'}
            </Button>
            <Button variant="text" color="primary" onClick={this.handleClickBack} className={parentClasses.button}>
              Back
            </Button>
          </div>
          {isLoading && (
            <React.Fragment>
              <div className={classes.overlay} />
              <LinearProgress className={classes.progress} color="secondary" />
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }

    return null;
  }
}

ClassInfoReview.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  parentClasses: PropTypes.shape({}).isRequired,
  submitCreateClassForm: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  classBaseInfo: PropTypes.shape({}).isRequired,
  classSchedules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  mode: PropTypes.string.isRequired
};

export default withStyles(styles)(ClassInfoReview);
