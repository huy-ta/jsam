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
import getStudentById from 'Services/students/selectors';

const ViewStudentInfo = props => {
  const { open, handleClose, student } = props;

  if (!_.isEmpty(student)) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'}>
        <DialogTitle>Student Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The following is just read-only information about the student. To edit this information, please navigate to
            the &quot;Find Student&quot; page.
          </DialogContentText>
          <List>
            <ListItem>
              <Avatar>
                <ClassIcon />
              </Avatar>
              <ListItemText primary="Name" secondary={student.name} />
            </ListItem>
            <ListItem>
              <Avatar>
                <ClassIcon />
              </Avatar>
              <ListItemText primary="Student Id" secondary={student.code} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="School" secondary={student.school} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Gender" secondary={student.gender} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Self Phone" secondary={student.phone.self} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Parent Phone" secondary={student.phone.parent} />{' '}
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

ViewStudentInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  student: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ students }, props) => ({
  student: getStudentById(students, props.studentId)
});

export default connect(mapStateToProps)(ViewStudentInfo);
