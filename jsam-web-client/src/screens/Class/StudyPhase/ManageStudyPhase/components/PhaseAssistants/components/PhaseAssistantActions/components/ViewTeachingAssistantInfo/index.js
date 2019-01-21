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
import getTeachingAssistantById from 'Services/teachingAssistants/selectors';

const ViewTeachingAssistantInfo = props => {
  const { open, handleClose, teachingAssistant } = props;

  if (!_.isEmpty(teachingAssistant)) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'}>
        <DialogTitle>TeachingAssistant Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The following is just read-only information about the teachingAssistant. To edit this information, please
            navigate to the &quot;Find Assistant&quot; page.
          </DialogContentText>
          <List>
            <ListItem>
              <Avatar>
                <ClassIcon />
              </Avatar>
              <ListItemText primary="Name" secondary={teachingAssistant.name} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Gender" secondary={teachingAssistant.gender} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Email" secondary={teachingAssistant.email} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Facebook" secondary={teachingAssistant.facebook} />
            </ListItem>
            <ListItem>
              <Avatar>
                <CourseIcon />
              </Avatar>
              <ListItemText primary="Phone" secondary={teachingAssistant.phone} />
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

ViewTeachingAssistantInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  teachingAssistant: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ teachingAssistants }, props) => ({
  teachingAssistant: getTeachingAssistantById(teachingAssistants, props.teachingAssistantId)
});

export default connect(mapStateToProps)(ViewTeachingAssistantInfo);
