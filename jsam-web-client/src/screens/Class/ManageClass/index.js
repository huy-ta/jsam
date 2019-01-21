import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { InlineDatePicker } from 'material-ui-pickers';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import EditIcon from '@material-ui/icons/Edit';

import Section from 'Shells/Section';
import ReactSuggestSelect from 'GlobalComponents/ReactSuggestSelect';
import PaperLoading from 'GlobalComponents/PaperLoading';
import useTextFieldInput from 'Hooks/useTextFieldInput';
import useRegexTextFieldInput from 'Hooks/useRegexTextFieldInput';

import { openSnackbar } from 'GlobalComponents/Notification';
import { validateFieldByOneRule } from 'Utils/validateField';
import { fetchClassesToReduxStore, addStudyPhaseToClassOnServer } from 'Services/classes/actions';
import { getPreSelectedClass } from 'Services/classes/selectors';

import EditClassDialog from './components/EditClassDialog';
import StudyPhaseTable from './components/StudyPhaseTable';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    position: 'relative',
    overflow: 'visible'
  },
  listItem: {
    padding: `${theme.spacing.unit * 0.5}px 0`
  },
  listItemText: {
    width: 'auto'
  },
  buttonIcon: {
    marginRight: theme.spacing.unit * 0.3
  }
});

const ManageClass = props => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoadingClass, setIsLoadingClass] = useState(false);
  const [isAddStudyPhaseLoading, setIsAddStudyPhaseLoading] = useState(false);
  const [isEditClassDialogOpen, setIsEditClassDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(moment());

  const { classes, studentClasses, preSelectedClass, dispatchFetchClassesToReduxStore } = props;

  const studyPhaseNameValidationRule = {
    method: 'isEmpty',
    message: 'Study phase name is required.',
    validWhen: false
  };
  const [studyPhaseNameClientError, setStudyPhaseNameClientError] = useState('');
  const studyPhaseNameInput = useTextFieldInput('');

  const numOfSessionInput = useRegexTextFieldInput('10', /^[0-9]{0,2}$/);
  const phaseFeeInput = useRegexTextFieldInput('700,000', /^[-+]?(?:[0-9]+,)*[0-9]+$/);

  useEffect(() => {
    setIsLoadingClass(true);
    (async () => {
      if (studentClasses.length === 0) {
        await dispatchFetchClassesToReduxStore();
      }
      setIsLoadingClass(false);
    })();
  }, []);

  useEffect(
    () => {
      if (preSelectedClass) {
        setSelectedClass(preSelectedClass);
      }
    },
    [preSelectedClass]
  );

  const handleSelectClass = newSelectedClass => {
    setSelectedClass(newSelectedClass);
    sessionStorage.setItem('selectedClass', newSelectedClass.value);
  };

  const handleStartDateChange = date => {
    setStartDate(date);
  };

  const handleCloseEditClassDialog = () => {
    setIsEditClassDialogOpen(false);
  };

  const handleOpenEditClassDialog = () => {
    setIsEditClassDialogOpen(true);
  };

  const performClientSideValidation = () => {
    const studyPhaseNameClientErrorTemp = validateFieldByOneRule(
      studyPhaseNameInput.value,
      studyPhaseNameValidationRule
    );
    setStudyPhaseNameClientError(studyPhaseNameClientErrorTemp);
    return !studyPhaseNameClientErrorTemp;
  };

  const handleReset = () => {
    studyPhaseNameInput.onChange({ target: { value: '' } });
    numOfSessionInput.onChange({ target: { value: '10' } });
    phaseFeeInput.onChange({ target: { value: '700,000' } });
    setStartDate(moment());
  };

  const handleAddStudyPhase = async e => {
    e.preventDefault();

    setIsAddStudyPhaseLoading(true);

    const isClientValid = performClientSideValidation();
    console.log(isClientValid);
    if (isClientValid) {
      try {
        const { dispatchAddStudyPhaseToClassOnServer } = props;

        const studyPhaseInfo = {
          name: studyPhaseNameInput.value,
          startDate: startDate.toDate(),
          numOfSessions: numOfSessionInput.value,
          phaseFee: phaseFeeInput.value.replace(',', '')
        };

        await dispatchAddStudyPhaseToClassOnServer(selectedClass._id, studyPhaseInfo);
        handleReset();
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar("The server isn't responding at the moment. Please try again later.");
        } else {
          // setServerErrors(response.data.errors);
        }
      }
    }

    setIsAddStudyPhaseLoading(false);
  };

  const suggestions = studentClasses.map(studentClass => ({
    value: studentClass._id,
    label: `${studentClass.name} - ${studentClass.course.name}`,
    ...studentClass
  }));

  return (
    <React.Fragment>
      <Section header="Class" subheader="Manage Class">
        <Paper className={classes.root}>
          <Typography variant="h6">Select Class</Typography>
          <ReactSuggestSelect
            suggestions={suggestions}
            placeholder="Select a class"
            value={selectedClass}
            onChange={handleSelectClass}
          />
          {isLoadingClass && <PaperLoading />}
        </Paper>
        <Paper className={classes.root}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">Class Information</Typography>
            </Grid>
            {selectedClass && (
              <React.Fragment>
                <Grid item>
                  <Button variant="text" color="primary" onClick={handleOpenEditClassDialog}>
                    <EditIcon className={classes.buttonIcon} />
                    Edit Class Information
                  </Button>
                </Grid>
                <EditClassDialog
                  item={selectedClass}
                  open={isEditClassDialogOpen}
                  handleClose={handleCloseEditClassDialog}
                />
              </React.Fragment>
            )}
          </Grid>
          {selectedClass ? (
            <Grid container>
              <Grid item xs={6}>
                <List disablePadding>
                  <ListItem className={classes.listItem}>
                    <ListItemText
                      className={classes.listItemText}
                      primary={'Class name'}
                      secondary={selectedClass.name}
                    />
                  </ListItem>
                  <ListItem className={classes.listItem}>
                    <ListItemText
                      className={classes.listItemText}
                      primary={'Course'}
                      secondary={selectedClass.course.name}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List disablePadding>
                  {selectedClass.normalSchedule.map((classSchedule, index) => (
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
          ) : (
            <Typography variant="body1">No class selected.</Typography>
          )}
        </Paper>
        {selectedClass && (
          <Paper className={classes.root}>
            <Typography variant="h6">Class&apos; Study Phase List</Typography>
            <form onSubmit={handleAddStudyPhase}>
              <Grid container spacing={24} alignItems="center">
                <Grid item>
                  <TextField
                    label="Study phase name"
                    {...studyPhaseNameInput}
                    error={!!studyPhaseNameClientError}
                    helperText={studyPhaseNameClientError}
                  />
                </Grid>
                <Grid item>
                  <div className="picker">
                    <InlineDatePicker
                      keyboard
                      format="DD/MM/YYYY"
                      label="Start date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    />
                  </div>
                </Grid>
                <Grid item>
                  <TextField label="Number of sessions" {...numOfSessionInput} />
                </Grid>
                <Grid item>
                  <TextField
                    label="Phase fee"
                    {...phaseFeeInput}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">VND</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" type="submit">
                    Add Study Phase
                  </Button>
                </Grid>
              </Grid>
            </form>
            <StudyPhaseTable studentClass={selectedClass} isLoading={isLoadingClass} />
            {isAddStudyPhaseLoading && <PaperLoading />}
          </Paper>
        )}
      </Section>
    </React.Fragment>
  );
};

ManageClass.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  studentClasses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchClassesToReduxStore: PropTypes.func.isRequired,
  dispatchAddStudyPhaseToClassOnServer: PropTypes.func.isRequired
};

const mapStateToProps = ({ classes }) => ({
  studentClasses: classes,
  preSelectedClass: getPreSelectedClass(classes)
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchClassesToReduxStore: () => dispatch(fetchClassesToReduxStore()),
  dispatchAddStudyPhaseToClassOnServer: (_id, studyPhaseInfo) =>
    dispatch(addStudyPhaseToClassOnServer(_id, studyPhaseInfo))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ManageClass));
