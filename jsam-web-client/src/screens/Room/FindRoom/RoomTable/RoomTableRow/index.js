import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateRoomOnServerById, deleteRoomOnServerById } from 'Services/rooms/actions';

const styles = theme => ({
  root: {},
  resize: {
    fontSize: theme.typography.tableBody.fontSize
  },
  buttonWrapper: {
    position: 'relative',
    display: 'inline'
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: 4,
    zIndex: 1
  },
  successIcon: {
    color: green[500]
  },
  symbol: {
    padding: '0 12px',
    paddingTop: '5px'
  },
  detailTeacher: {
    padding: theme.spacing.unit * 0.5
  }
});

class RoomTableRow extends React.Component {
  state = {
    editModeOn: false,
    editSuccess: false,
    editLoading: false,
    editPostLoading: false,
    deleteLoading: false,
    deletePostLoading: false,
    deleteSuccess: false,
    input: {}
  };

  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, floor, capacity } = item;

    this.setState(() => ({
      editModeOn: true,
      editSuccess: false,
      editLoading: false,
      editPostLoading: false,
      deleteLoading: false,
      deletePostLoading: false,
      input: {
        _id,
        name,
        floor,
        capacity
      }
    }));
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const { _id, name, floor, capacity } = input;

    const roomUpdateData = {
      name,
      floor,
      capacity
    }
    this.setState(() => ({ editLoading: true, editPostLoading: false }));
    try {

      const { dispatchUpdateRoomOnServerById } = this.props;
      await dispatchUpdateRoomOnServerById(_id, roomUpdateData);

      this.setState(() => ({ editLoading: false, editSuccess: true, editPostLoading: true }));

      this.timer = setTimeout(() => {
        this.setState({
          editPostLoading: false,
          editSuccess: false,
          editModeOn: false
        });
      }, 1000);
    } catch (err) {
      this.setState(() => ({ editLoading: false, editSuccess: false, editPostLoading: true }));
      this.timer = setTimeout(() => {
        this.setState({
          editPostLoading: false,
          editSuccess: false,
          editModeOn: false
        });
      }, 3000);
    }

  };

  handleCancelEdit = () => {
    this.setState(() => ({ editModeOn: false }));
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const { value } = e.target;
    let inputTemp = input;
    inputTemp[prop] = value;
    this.setState(() => ({ input: inputTemp }));
  };

  handleDelete = async () => {
    try {
      this.setState(() => ({ deleteLoading: true }));
      const { item } = this.props;
      const { dispatchDeleteRoomOnServerById } = this.props;
      await dispatchDeleteRoomOnServerById(item._id);

      this.setState(() => ({ deleteLoading: false, deletePostLoading: true, deleteSuccess: true }));
      this.timer = setTimeout(() => {
        this.setState({
          deletePostLoading: false,
          deleteSuccess: false
        });
      }, 1000);
    } catch (err) {
      this.setState(() => ({ deleteLoading: false, deleteSuccess: false, deletePostLoading: true }));
      this.timer = setTimeout(() => {
        this.setState(() => ({
          deletePostLoading: false,
          deleteSuccess: false
        }));
      }, 3000);
    }
  };

  render() {
    const { classes, item } = this.props;

    const {
      editModeOn,
      editSuccess,
      editLoading,
      input,
      editPostLoading,
      deleteLoading,
      deletePostLoading,
      deleteSuccess
    } = this.state;

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating room...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated room';
        } else {
          editButtonTooltipTitle = 'Updating room failed';
        }
      }
    }

    let deleteButtonTooltipTitle = 'Delete';
    if (deleteLoading) {
      deleteButtonTooltipTitle = 'Deleting room...';
    } else if (deletePostLoading) {
      if (deleteSuccess) {
        deleteButtonTooltipTitle = 'Successfully deleted room';
      } else {
        deleteButtonTooltipTitle = 'Deleting room failed';
      }
    }

    return (
      <TableRow>
        {editModeOn ? (
          <React.Fragment>
            <CustomTableCell>
              <TextField
                id="name"
                value={input.name}
                onChange={this.handleInputChange('name')}
                disabled={editLoading || editPostLoading}
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
              />
            </CustomTableCell>
            <CustomTableCell>
              <TextField
                id="floor"
                value={input.floor}
                onChange={this.handleInputChange('floor')}
                disabled={editLoading || editPostLoading}
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
              />
            </CustomTableCell>
            <CustomTableCell>
              <TextField
                id="capacity"
                value={input.capacity}
                onChange={this.handleInputChange('capacity')}
                disabled={editLoading || editPostLoading}
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
              />
            </CustomTableCell>
            <CustomTableCell>
              <div className={classes.buttonWrapper}>
                <Tooltip title={editButtonTooltipTitle}>
                  <IconButton
                    color="inherit"
                    onClick={editLoading || editPostLoading ? undefined : this.handleConfirmEdit}
                  >
                    {editPostLoading ? (
                      (() => {
                        if (editSuccess) {
                          return <CheckIcon className={classes.successIcon} />;
                        }
                        return <ErrorIcon color="error" />;
                      })()
                    ) : (
                        <SaveIcon color={editLoading ? 'primary' : 'action'} />
                      )}
                  </IconButton>
                </Tooltip>
                {editLoading && !editSuccess && <CircularProgress className={classes.fabProgress} />}
              </div>
              <Tooltip title="Cancel">
                <IconButton color="inherit" onClick={this.handleCancelEdit} disabled={editLoading || editPostLoading}>
                  <Cancel color={editLoading || editPostLoading ? 'disabled' : 'action'} />
                </IconButton>
              </Tooltip>
            </CustomTableCell>
          </React.Fragment>
        ) : (
            <React.Fragment>
              <CustomTableCell>{item.name}</CustomTableCell>
              <CustomTableCell>{item.floor}</CustomTableCell>
              <CustomTableCell>{item.capacity}</CustomTableCell>
              <CustomTableCell>
                <Tooltip title={editButtonTooltipTitle}>
                  <IconButton color="inherit" onClick={this.handleEdit}>
                    <Edit color="action" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={deleteButtonTooltipTitle}>
                  <div className={classes.buttonWrapper}>
                    <IconButton
                      color="inherit"
                      onClick={deleteLoading || deletePostLoading ? undefined : this.handleDelete}
                    >
                      {deletePostLoading ? (
                        (() => {
                          if (deleteSuccess) {
                            return <CheckIcon className={classes.successIcon} />;
                          }
                          return <ErrorIcon color="error" />;
                        })()
                      ) : (
                          <Delete color={deleteLoading ? 'primary' : 'action'} />
                        )}
                    </IconButton>
                    {deleteLoading && <CircularProgress className={classes.fabProgress} />}
                    {deletePostLoading && <div className={classes.postLoadingOverlay} />}
                  </div>
                </Tooltip>
              </CustomTableCell>
            </React.Fragment>
          )}
      </TableRow>
    );
  }
}

RoomTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  dispatchUpdateRoomOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateRoomOnServerById: (_id, roomUpdateData) =>
    dispatch(updateRoomOnServerById(_id, roomUpdateData)),
  dispatchDeleteRoomOnServerById: _id => dispatch(deleteRoomOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(RoomTableRow));