import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ViewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import { removePhaseStudentOnServerById } from 'Services/phases/actions';
import ViewStudentInfo from './components/ViewStudentInfo';

const PhaseStudentActions = props => {
  const { studentId, setLoading } = props;

  const [isViewStudentInfoOpen, setIsViewStudentInfoOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsViewStudentInfoOpen(false);
  };

  const handleOpenDialog = () => {
    setIsViewStudentInfoOpen(true);
  };

  const handleRemovePhaseStudent = async () => {
    const { dispatchRemovePhaseStudentOnServerById, phaseId } = props;

    setLoading(true);

    try {
      await dispatchRemovePhaseStudentOnServerById(phaseId, studentId);
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
      <Tooltip title={'Remove student'}>
        <IconButton onClick={handleRemovePhaseStudent}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
      <ViewStudentInfo handleClose={handleCloseDialog} open={isViewStudentInfoOpen} studentId={studentId} />
    </React.Fragment>
  );
};

PhaseStudentActions.propTypes = {
  phaseId: PropTypes.string.isRequired,
  studentId: PropTypes.string.isRequired,
  dispatchRemovePhaseStudentOnServerById: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchRemovePhaseStudentOnServerById: (phaseId, studentId) =>
    dispatch(removePhaseStudentOnServerById(phaseId, studentId))
});

export default connect(
  undefined,
  mapDispatchToProps
)(PhaseStudentActions);
