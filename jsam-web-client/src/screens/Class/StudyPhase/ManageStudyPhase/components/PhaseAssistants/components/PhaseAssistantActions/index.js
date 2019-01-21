import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ViewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import { removePhaseTeachingAssistantOnServerById } from 'Services/phases/actions';
import ViewTeachingAssistantInfo from './components/ViewTeachingAssistantInfo';

const PhaseTeachingAssistantActions = props => {
  const { teachingAssistantId, setLoading } = props;

  const [isViewTeachingAssistantInfoOpen, setIsViewTeachingAssistantInfoOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsViewTeachingAssistantInfoOpen(false);
  };

  const handleOpenDialog = () => {
    setIsViewTeachingAssistantInfoOpen(true);
  };

  const handleRemovePhaseTeachingAssistant = async () => {
    const { dispatchRemovePhaseTeachingAssistantOnServerById, phaseId } = props;

    setLoading(true);

    try {
      await dispatchRemovePhaseTeachingAssistantOnServerById(phaseId, teachingAssistantId);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <React.Fragment>
      <Tooltip title={'View detailed info'}>
        <IconButton onClick={handleOpenDialog}>
          <ViewIcon color="action" />
        </IconButton>
      </Tooltip>
      <Tooltip title={'Remove teaching assistant'}>
        <IconButton onClick={handleRemovePhaseTeachingAssistant}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
      <ViewTeachingAssistantInfo
        handleClose={handleCloseDialog}
        open={isViewTeachingAssistantInfoOpen}
        teachingAssistantId={teachingAssistantId}
      />
    </React.Fragment>
  );
};

PhaseTeachingAssistantActions.propTypes = {
  phaseId: PropTypes.string.isRequired,
  teachingAssistantId: PropTypes.string.isRequired,
  dispatchRemovePhaseTeachingAssistantOnServerById: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchRemovePhaseTeachingAssistantOnServerById: (phaseId, teachingAssistantId) =>
    dispatch(removePhaseTeachingAssistantOnServerById(phaseId, teachingAssistantId))
});

export default connect(
  undefined,
  mapDispatchToProps
)(PhaseTeachingAssistantActions);
