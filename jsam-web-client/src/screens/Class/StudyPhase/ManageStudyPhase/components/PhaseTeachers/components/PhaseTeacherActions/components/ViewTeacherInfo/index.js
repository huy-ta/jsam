import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CourseIcon from '@material-ui/icons/FolderSpecial';
import ClassIcon from '@material-ui/icons/Class';
import getTeacherById from 'Services/teachers/selectors';

const ViewTeacherInfo = props => {
  const { open, handleClose, teacher } = props;

  if (!_.isEmpty(teacher)) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'}>
        <DialogTitle>Teacher Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The following is just read-only information about the teacher. To edit this information, please navigate to
            the &quot;Find Teacher&quot; page.
          </DialogContentText>
          <List>
            <ListItem>
              <Avatar>
                <ClassIcon />
              </Avatar>
              <ListItemText primary="Name" secondary={teacher.name} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Gender" secondary={teacher.gender} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Email" secondary={teacher.email} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Facebook" secondary={teacher.facebook} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Phone" secondary={teacher.phone} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Speciality" secondary={teacher.speciality ? teacher.speciality.name : ''} />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
};

ViewTeacherInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  teacher: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ teachers }, props) => ({
  teacher: getTeacherById(teachers, props.teacherId)
});

export default connect(mapStateToProps)(ViewTeacherInfo);
