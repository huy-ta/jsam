import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ReactSuggestSelect from 'GlobalComponents/ReactSuggestSelect';
import PaperLoading from 'GlobalComponents/PaperLoading';
import SimpleCustomTable from 'GlobalComponents/SimpleCustomTable';
import { openSnackbar } from 'GlobalComponents/Notification';

import { fetchStudentsToReduxStore } from 'Services/students/actions';

import PhaseStudentActions from './components/PhaseStudentActions';

const columnProps = [
  {
    id: 'index',
    placement: 'bottom-start',
    disablePadding: true,
    sortable: true,
    label: '#',
    width: '5%'
  },
  {
    id: 'studentName',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Name',
    width: '40%'
  },
  {
    id: 'studentCode',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Student Id',
    width: '40%'
  },
  {
    id: 'actions',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: false,
    label: '',
    width: '15%'
  }
];

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    position: 'relative'
  },
  button: {
    marginTop: theme.spacing.unit
  }
});

const PhaseStudents = props => {
  const { classes, phase, show, students, dispatchFetchStudentsToReduxStore } = props;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    setIsSubmitLoading(true);
    (async () => {
      if (students.length === 0) {
        await dispatchFetchStudentsToReduxStore();
      }
      setIsSubmitLoading(false);
    })();
  }, []);

  const handleSelectStudent = newSelectedStudent => {
    setSelectedStudent(newSelectedStudent);
  };

  const handleReset = () => {
    setSelectedStudent(null);
  };

  const handleAddPhaseStudent = async e => {
    e.preventDefault();

    const { fetchPhase } = props;

    setIsSubmitLoading(true);

    try {
      if (!selectedStudent) {
        openSnackbar('Please fill in all the information first.');
      } else {
        const studentId = selectedStudent._id;

        await axios.post(`/api/study-phases/${phase._id}/students`, {
          students: [{ studentId }]
        });
        await fetchPhase();
        handleReset();
      }
    } catch (err) {
      const { response } = err;
      if (response.status === 504) {
        openSnackbar("The server isn't responding at the moment. Please try again later.");
      } else {
        openSnackbar('Cannot add that student.');
      }
    }

    setIsSubmitLoading(false);
  };

  let studentSuggestions = [];
  if (students) {
    studentSuggestions = students.map(student => ({
      value: student._id,
      label: `${student.name} - ${student.code} - ${student.school}`,
      ...student
    }));
  }

  if (show) {
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Typography variant="h6">Add Phase Student</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} md={6}>
              <ReactSuggestSelect
                suggestions={studentSuggestions}
                placeholder="Select a student"
                value={selectedStudent}
                onChange={handleSelectStudent}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleAddPhaseStudent} className={classes.button}>
                Add Student
              </Button>
            </Grid>
          </Grid>

          {isSubmitLoading && <PaperLoading />}
        </Paper>
        <Paper className={classes.root}>
          <SimpleCustomTable
            tableTitle="Phase Student List"
            notFoundMessage="No phase student found."
            columnProps={columnProps}
            rows={phase.students}
            rowKeyProp="studentId"
            ActionComponent={actionComponentProps => (
              <PhaseStudentActions
                phaseId={phase._id}
                studentId={actionComponentProps.selectedItemId}
                setLoading={setIsTableLoading}
              />
            )}
          />
          {isTableLoading && <PaperLoading />}
        </Paper>
      </React.Fragment>
    );
  }
  return null;
};

PhaseStudents.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired,
  show: PropTypes.bool.isRequired,
  fetchPhase: PropTypes.func.isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchStudentsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ students }) => ({
  students
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchStudentsToReduxStore: () => dispatch(fetchStudentsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PhaseStudents));
