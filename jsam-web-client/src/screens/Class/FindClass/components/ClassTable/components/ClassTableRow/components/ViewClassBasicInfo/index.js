import React from 'react';
import PropTypes from 'prop-types';

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
import ScheduleIcon from '@material-ui/icons/Schedule';

const ViewClassBasicInfo = props => {
  const { item, open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={item.normalSchedule.length > 2 ? 'lg' : 'md'}>
      <DialogTitle>Class Basic Information</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The following is just some basic information about the class. For more detailed information, please click the
          &quot;Manage class&quot; button next to the &quot;View basic info&quot; button.
        </DialogContentText>
        <List>
          <ListItem>
            <Avatar>
              <ClassIcon />
            </Avatar>
            <ListItemText primary="Class" secondary={item.name} />
          </ListItem>
          <ListItem>
            <Avatar>
              <CourseIcon />
            </Avatar>
            <ListItemText primary="Course" secondary={item.course.name} />
          </ListItem>
          <ListItem>
            <Avatar>
              <ScheduleIcon />
            </Avatar>
            {item.normalSchedule.map((schedule, index) => (
              <ListItemText
                key={schedule.weekDay}
                primary={`Schedule ${index + 1}`}
                secondary={`${schedule.weekDay} from ${schedule.startTime} to ${schedule.endTime} in ${schedule.room}`}
              />
            ))}
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
};

ViewClassBasicInfo.propTypes = {
  item: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default ViewClassBasicInfo;
