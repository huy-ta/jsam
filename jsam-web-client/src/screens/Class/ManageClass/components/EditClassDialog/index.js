import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from '@material-ui/icons/Clear';

import AddOrUpdateClass from '../../../AddOrUpdateClass';

const EditClassDialog = props => {
  const { item, open, handleClose } = props;

  const handleEditClass = async (requestPayload, classId) => {
    try {
      const response = await axios.put(`/api/classes/${classId}`, requestPayload);

      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleNavigationBlock = () => {};

  const classBaseInfo = {
    _id: item._id,
    name: item.name,
    course: item.course
  };

  const classSchedules = item.normalSchedule;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <DialogTitle>Edit Class</DialogTitle>
        </Grid>
        <Grid item>
          <DialogActions>
            <IconButton onClick={handleClose}>
              <CloseIcon color="primary" />
            </IconButton>
          </DialogActions>
        </Grid>
      </Grid>
      <DialogContent>
        <AddOrUpdateClass
          classBaseInfo={classBaseInfo}
          classSchedules={classSchedules}
          handleSubmit={handleEditClass}
          handleNavigationBlock={handleNavigationBlock}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
};

EditClassDialog.propTypes = {
  item: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default EditClassDialog;
