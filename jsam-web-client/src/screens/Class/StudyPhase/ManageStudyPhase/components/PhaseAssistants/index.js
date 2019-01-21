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

import { fetchTeachingAssistantsToReduxStore } from 'Services/teachingAssistants/actions';
import { fetchRolesToReduxStore } from 'Services/roles/actions';

import PhaseTeachingAssistantActions from './components/PhaseAssistantActions';

const columnProps = [
  {
    id: 'teachingAssistantName',
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

const PhaseTeachingAssistants = props => {
  const {
    classes,
    phase,
    show,
    teachingAssistants,
    roles,
    dispatchFetchTeachingAssistantsToReduxStore,
    dispatchFetchRolesToReduxStore
  } = props;
  const [selectedTeachingAssistant, setSelectedTeachingAssistant] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    setIsSubmitLoading(true);
    (async () => {
      if (teachingAssistants.length === 0) {
        await dispatchFetchTeachingAssistantsToReduxStore();
      }
      if (roles.length === 0) {
        await dispatchFetchRolesToReduxStore();
      }
      setIsSubmitLoading(false);
    })();
  }, []);

  const handleSelectTeachingAssistant = newSelectedTeachingAssistant => {
    setSelectedTeachingAssistant(newSelectedTeachingAssistant);
  };

  const handleSelectRole = newSelectedRole => {
    setSelectedRole(newSelectedRole);
  };

  const handleReset = () => {
    setSelectedTeachingAssistant(null);
    setSelectedRole(null);
  };

  const handleAddPhaseTeachingAssistant = async e => {
    e.preventDefault();

    const { fetchPhase } = props;

    setIsSubmitLoading(true);

    try {
      if (!selectedTeachingAssistant || !selectedRole) {
        openSnackbar('Please fill in all the information first.');
      } else {
        const teachingAssistantId = selectedTeachingAssistant._id;
        const roleId = selectedRole._id;

        await axios.post(`/api/study-phases/${phase._id}/teaching-assistants`, {
          teachingAssistants: [{ teachingAssistantId, roleId }]
        });
        await fetchPhase();
        handleReset();
      }
    } catch (err) {
      const { response } = err;
      if (response.status === 504) {
        openSnackbar("The server isn't responding at the moment. Please try again later.");
      } else {
        openSnackbar('Cannot add that teaching assistant.');
      }
    }

    setIsSubmitLoading(false);
  };

  let teachingAssistantSuggestions = [];
  if (teachingAssistants) {
    teachingAssistantSuggestions = teachingAssistants.map(teachingAssistant => ({
      value: teachingAssistant._id,
      label: `${teachingAssistant.name} - ${teachingAssistant.email}`,
      ...teachingAssistant
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
          <Typography variant="h6">Add Phase Teaching Assistant</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} md={6}>
              <ReactSuggestSelect
                suggestions={teachingAssistantSuggestions}
                placeholder="Select a teaching assistant"
                value={selectedTeachingAssistant}
                onChange={handleSelectTeachingAssistant}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPhaseTeachingAssistant}
                className={classes.button}
              >
                Add Teaching Assistant
              </Button>
            </Grid>
          </Grid>

          {isSubmitLoading && <PaperLoading />}
        </Paper>
        <Paper className={classes.root}>
          <SimpleCustomTable
            tableTitle="Phase Teaching Assistant List"
            notFoundMessage="No phase teaching assistant found."
            columnProps={columnProps}
            rows={phase.teachingAssistants}
            rowKeyProp="teachingAssistantId"
            ActionComponent={actionComponentProps => (
              <PhaseTeachingAssistantActions
                phaseId={phase._id}
                teachingAssistantId={actionComponentProps.selectedItemId}
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

PhaseTeachingAssistants.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired,
  show: PropTypes.bool.isRequired,
  fetchPhase: PropTypes.func.isRequired,
  teachingAssistants: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchTeachingAssistantsToReduxStore: PropTypes.func.isRequired,
  dispatchFetchRolesToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ teachingAssistants, roles }) => ({
  teachingAssistants,
  roles
});

const mapDispatchToProps = dispatch => ({
  dispatchFetchTeachingAssistantsToReduxStore: () => dispatch(fetchTeachingAssistantsToReduxStore()),
  dispatchFetchRolesToReduxStore: () => dispatch(fetchRolesToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PhaseTeachingAssistants));
