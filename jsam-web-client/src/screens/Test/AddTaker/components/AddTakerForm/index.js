import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import { emphasize } from '@material-ui/core/styles/colorManipulator';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';
import ReactSuggestSelect from 'GlobalComponents/ReactSuggestSelect';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';

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
  },
  root2: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

const defaultInput = () => ({
  studentId: '',
  mark: '',
  date: ''
});

class AddTakerForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'mark',
      method: 'isEmpty',
      validWhen: false,
      message: 'Test name is required.'
    }
  ]);

  state = {
    input: defaultInput(),
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {},
    selectedStudent: '',
    selectedDate: new Date()
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  // FIXME: Needs refactoring

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
    const { idTest } = this.props;
    const { input, selectedStudent, selectedDate } = this.state;
    e.preventDefault();
    this.triggerLoadingState();

    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      try {
        const inputTemp = input;
        inputTemp.studentId = selectedStudent.value;
        inputTemp.date = selectedDate;
        this.setState(() => ({ input: inputTemp }));

        await axios.post(`/api/tests/${idTest}/takers`, input);
        this.handleReset();
        openSnackbar('Successfully added takers.');
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar(
            "The server isn't responding at the moment. Please try again later."
          );
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

  handleSelectStudent = newSelectedStudent => {
    this.setState({
      selectedStudent: newSelectedStudent
    });
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  render() {
    const { classes, students } = this.props;
    const {
      input,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors,
      selectedStudent,
      selectedDate
    } = this.state;

    let validation = hasEverSubmitted
      ? this.validator.validate(input)
      : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    const suggestions = students.map(student => ({
      value: student._id,
      label: `${student.name} - ${student.phone.self}`,
      ...student
    }));

    return (
      <React.Fragment>
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid spacing={24} container>
            <Grid item xs={12} lg={6}>
              <ReactSuggestSelect
                suggestions={suggestions}
                placeholder="Select a student"
                value={selectedStudent}
                onChange={this.handleSelectStudent}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="mark"
                label="Student's mark"
                className={classes.textField}
                value={input.mark}
                onChange={this.handleInputChange('mark')}
                error={!!serverErrors.mark || validation.mark.isInvalid}
                helperText={serverErrors.mark || '' || validation.mark.message}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  value={selectedDate}
                  onChange={this.handleDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                Add Takers
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
    );
  }
}

AddTakerForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  idTest: PropTypes.string.isRequired
};
const mapStateToProps = ({ students }) => ({ students });

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(AddTakerForm)
);
