import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';

import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ManageIcon from '@material-ui/icons/DeviceHub';
import Visibility from '@material-ui/icons/Visibility';

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { APP_LINKS } from 'Config/routers/appLinks';

import ViewClassBasicInfo from './components/ViewClassBasicInfo';

const styles = () => ({
  root: {}
});

const ClassTableRow = props => {
  const [isViewClassBasicInfoDialogOpen, setIsViewClassBasicInfoDialogOpen] = useState(false);
  const { classes, item, history } = props;

  const handleCloseDialog = () => {
    setIsViewClassBasicInfoDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setIsViewClassBasicInfoDialogOpen(true);
  };

  const navigateToManageClass = () => {
    sessionStorage.setItem('selectedClass', item._id);
    history.push(APP_LINKS.MANAGE_CLASS);
  };

  return (
    <TableRow className={classes.root} hover role="checkbox" tabIndex={-1} key={item._id}>
      <CustomTableCell>{item.name}</CustomTableCell>
      <CustomTableCell>{item.course.name}</CustomTableCell>
      <CustomTableCell>
        <Tooltip title={'View basic info'}>
          <IconButton onClick={handleOpenDialog}>
            <Visibility color="action" />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Manage class'}>
          <IconButton onClick={navigateToManageClass}>
            <ManageIcon color="action" />
          </IconButton>
        </Tooltip>
      </CustomTableCell>
      <ViewClassBasicInfo open={isViewClassBasicInfoDialogOpen} handleClose={handleCloseDialog} item={item} />
    </TableRow>
  );
};

ClassTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired
};

export default withRouter(withStyles(styles)(ClassTableRow));
