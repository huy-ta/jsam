import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ManageIcon from '@material-ui/icons/DeviceHub';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

import ManageStudyPhase from 'Screens/Class/StudyPhase/ManageStudyPhase';

const styles = () => ({
  root: {}
});

const StudyPhaseTableRow = props => {
  const [isManageStudyPhaseDialogOpen, setIsManageStudyPhaseDialogOpen] = useState(false);

  const { classes, item, studentClass } = props;

  const handleOpenStudyPhaseDialog = () => {
    setIsManageStudyPhaseDialogOpen(true);
  };

  const handleCloseStudyPhaseDialog = () => {
    setIsManageStudyPhaseDialogOpen(false);
  };

  let status = 'Unknown';
  if (item.endDate) {
    status = 'Finished';
  } else {
    status = 'Ongoing';
  }

  return (
    <TableRow className={classes.root} hover role="checkbox" tabIndex={-1} key={item._id}>
      <CustomTableCell>{item.name}</CustomTableCell>
      <CustomTableCell>{moment(item.startDate).format('MMM Do YYYY')}</CustomTableCell>
      <CustomTableCell>{item.endDate ? moment(item.endDate).format('MMM Do YYYY') : ''}</CustomTableCell>
      <CustomTableCell>{status}</CustomTableCell>
      <CustomTableCell>
        <Tooltip title={'Manage study phase'}>
          <IconButton onClick={handleOpenStudyPhaseDialog}>
            <ManageIcon color="action" />
          </IconButton>
        </Tooltip>
      </CustomTableCell>
      <ManageStudyPhase
        open={isManageStudyPhaseDialogOpen}
        handleClose={handleCloseStudyPhaseDialog}
        studyPhaseId={item.phaseId}
        studentClass={studentClass}
      />
    </TableRow>
  );
};

StudyPhaseTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  studentClass: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(StudyPhaseTableRow);
