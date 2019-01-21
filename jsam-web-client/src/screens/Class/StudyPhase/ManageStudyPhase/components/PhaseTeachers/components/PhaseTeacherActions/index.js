import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ViewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import { removePhaseTeacherOnServerById } from 'Services/phases/actions';
import ViewTeacherInfo from './components/ViewTeacherInfo';

const PhaseTeacherActions = props => {
  const { teacherId, setLoading } = props;

  const [isViewTeacherInfoOpen, setIsViewTeacherInfoOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsViewTeacherInfoOpen(false);
  };

  const handleOpenDialog = () => {
    setIsViewTeacherInfoOpen(true);
  };

  const handleRemovePhaseTeacher = async () => {
    const { dispatchRemovePhaseTeacherOnServerById, phaseId } = props;

    setLoading(true);

    try {
      await dispatchRemovePhaseTeacherOnServerById(phaseId, teacherId);
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
      <Tooltip title={'Remove teacher'}>
        <IconButton onClick={handleRemovePhaseTeacher}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
      <ViewTeacherInfo handleClose={handleCloseDialog} open={isViewTeacherInfoOpen} teacherId={teacherId} />
    </React.Fragment>
  );
};

PhaseTeacherActions.propTypes = {
  phaseId: PropTypes.string.isRequired,
  teacherId: PropTypes.string.isRequired,
  dispatchRemovePhaseTeacherOnServerById: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchRemovePhaseTeacherOnServerById: (phaseId, teacherId) =>
    dispatch(removePhaseTeacherOnServerById(phaseId, teacherId))
});

export default connect(
  undefined,
  mapDispatchToProps
)(PhaseTeacherActions);
