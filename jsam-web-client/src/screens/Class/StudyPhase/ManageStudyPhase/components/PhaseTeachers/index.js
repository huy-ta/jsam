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

import { fetchTeachersToReduxStore } from 'Services/teachers/actions';
import { fetchRolesToReduxStore } from 'Services/roles/actions';

import PhaseTeacherActions from './components/PhaseTeacherActions';

const columnProps = [
  {
    id: 'teacherName',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Name',
    width: '43%'
  },
  {
    id: 'roleName',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Role',
    width: '42%'
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

const PhaseTeachers = props => {
  const {
    classes,
    phase,
    show,
    teachers,
    roles,
    dispatchFetchTeachersToReduxStore,
    dispatchFetchRolesToReduxStore
  } = props;
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    setIsSubmitLoading(true);
    (async () => {
      if (teachers.length === 0) {
        await dispatchFetchTeachersToReduxStore();
      }
      if (roles.length === 0) {
        await dispatchFetchRolesToReduxStore();
      }
      setIsSubmitLoading(false);
    })();
  }, []);

  const handleSelectTeacher = newSelectedTeacher => {
    setSelectedTeacher(newSelectedTeacher);
  };

  const handleSelectRole = newSelectedRole => {
    setSelectedRole(newSelectedRole);
  };

  const handleReset = () => {
    setSelectedTeacher(null);
    setSelectedRole(null);
  };

  const handleAddPhaseTeacher = async e => {
    e.preventDefault();

    const { fetchPhase } = props;

    setIsSubmitLoading(true);

    try {
      if (!selectedTeacher || !selectedRole) {
        openSnackbar('Please fill in all the information first.');
      } else {
        const teacherId = selectedTeacher._id;
        const roleId = selectedRole._id;

        await axios.post(`/api/study-phases/${phase._id}/teachers`, {
          teachers: [{ teacherId, roleId }]
        });
        await fetchPhase();
        handleReset();
      }
    } catch (err) {
      const { response } = err;
      if (response.status === 504) {
        openSnackbar("The server isn't responding at the moment. Please try again later.");
      } else {
        openSnackbar('Cannot add that teacher.');
      }
    }

    setIsSubmitLoading(false);
  };

  let teacherSuggestions = [];
  if (teachers) {
    teacherSuggestions = teachers.map(teacher => ({
      value: teacher._id,
      label: `${teacher.name} - ${teacher.email}`,
      ...teacher
    }));
  }

  let roleSuggestions = [];
  if (roles) {
    roleSuggestions = roles.map(role => ({
      value: role._id,
      label: `${role.name}`,
      ...role
    }));
  }

  if (show) {
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Typography variant="h6">Add Phase Teacher</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} md={6}>
              <ReactSuggestSelect
                suggestions={teacherSuggestions}
                placeholder="Select a teacher"
                value={selectedTeacher}
                onChange={handleSelectTeacher}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReactSuggestSelect
                suggestions={roleSuggestions}
                placeholder="Select a role"
                value={selectedRole}
                onChange={handleSelectRole}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleAddPhaseTeacher} className={classes.button}>
                Add Teacher
              </Button>
            </Grid>
          </Grid>

          {isSubmitLoading && <PaperLoading />}
        </Paper>
        <Paper className={classes.root}>
          <SimpleCustomTable
            tableTitle="Phase Teacher List"
            notFoundMessage="No phase teacher found."
            columnProps={columnProps}
            rows={phase.teachers}
            rowKeyProp="teacherId"
            ActionComponent={actionComponentProps => (
              <PhaseTeacherActions
                phaseId={phase._id}
                teacherId={actionComponentProps.selectedItemId}
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

PhaseTeachers.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired,
  show: PropTypes.bool.isRequired,
  fetchPhase: PropTypes.func.isRequired,
  teachers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchTeachersToReduxStore: PropTypes.func.isRequired,
  dispatchFetchRolesToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ teachers, roles }) => ({
  teachers,
  roles
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchTeachersToReduxStore: () => dispatch(fetchTeachersToReduxStore()),
  dispatchFetchRolesToReduxStore: () => dispatch(fetchRolesToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PhaseTeachers));
