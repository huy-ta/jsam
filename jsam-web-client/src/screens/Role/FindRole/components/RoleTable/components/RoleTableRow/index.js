import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
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
import { updateRoleOnServerById, deleteRoleOnServerById } from 'Services/roles/actions';

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
    top: -8,
    left: 4,
    zIndex: 1
  },
  postLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: '100%',
    height: '100%'
  },
  successIcon: {
    color: green[500]
  },
  symbol: {
    padding: '0 12px',
    paddingTop: '5px'
  }
});

class RoleTableRow extends React.Component {
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

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, description } = item;

    this.setState(() => ({
      editModeOn: true,
      editSuccess: false,
      editLoading: false,
      editPostLoading: false,
      input: {
        _id,
        name,
        description
      }
    }));
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const { _id } = input;
    const roleUpdateData = { ...input };

    this.setState(() => ({ editLoading: true }));
    try {
      const { dispatchUpdateRoleOnServerById } = this.props;
      await dispatchUpdateRoleOnServerById(_id, roleUpdateData);

      this.setState(() => ({
        editLoading: false,
        editSuccess: true,
        editPostLoading: true
      }));

      this.timer = setTimeout(() => {
        this.setState({
          editPostLoading: false,
          editSuccess: false,
          editModeOn: false
        });
      }, 1000);
    } catch (err) {
      this.setState(() => ({
        editLoading: false,
        editSuccess: false,
        editPostLoading: true
      }));
      this.timer = setTimeout(() => {
        this.setState(() => ({
          editPostLoading: false,
          editSuccess: false,
          editModeOn: false
        }));
      }, 3000);
    }
  };

  handleCancelEdit = () => {
    this.setState(() => ({ editModeOn: false }));
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const { value } = e.target;
    let inputTemp = { ...input };

    if (!prop.includes('phone')) {
      inputTemp[prop] = value;
      this.setState(() => ({ input: inputTemp }));
    } else {
      const props = prop.split('.');
      inputTemp[props[0]][props[1]] = value;
      this.setState(() => ({ input: inputTemp }));
    }
  };

  handleDelete = async () => {
    try {
      this.setState(() => ({ deleteLoading: true }));
      const { item } = this.props;
      const { dispatchDeleteRoleOnServerById } = this.props;
      await dispatchDeleteRoleOnServerById(item._id);

      this.setState(() => ({
        deleteLoading: false,
        deletePostLoading: true,
        deleteSuccess: true
      }));
      this.timer = setTimeout(() => {
        this.setState({
          deletePostLoading: false,
          deleteSuccess: false
        });
      }, 1000);
    } catch (err) {
      this.setState(() => ({
        deleteLoading: false,
        deleteSuccess: false,
        deletePostLoading: true
      }));
      this.timer = setTimeout(() => {
        this.setState(() => ({
          deletePostLoading: false,
          deleteSuccess: false
        }));
      }, 3000);
    }
  };

  render() {
    const { classes, item, isSelected, handleClick } = this.props;
    const { editModeOn, editSuccess, editLoading, input, editPostLoading, deleteLoading, deletePostLoading, deleteSuccess } = this.state;

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating role...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated role';
        } else {
          editButtonTooltipTitle = 'Updating role failed';
        }
      }
    }

    let deleteButtonTooltipTitle = 'Delete';
    if (deleteLoading) {
      deleteButtonTooltipTitle = 'Deleting role...';
    } else if (deletePostLoading) {
      if (deleteSuccess) {
        deleteButtonTooltipTitle = 'Successfully deleted role';
      } else {
        deleteButtonTooltipTitle = 'Deleting role failed';
      }
    }

    return (
      <TableRow hover role="checkbox" aria-checked={isSelected} tabIndex={-1} key={item._id} selected={editModeOn || isSelected}>
        <CustomTableCell padding="checkbox">
          <Checkbox checked={isSelected} color="primary" onClick={event => handleClick(event, item._id)} />
        </CustomTableCell>
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
                id="description"
                value={input.description}
                onChange={this.handleInputChange('description')}
                disabled={editLoading || editPostLoading}
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
                fullWidth
              />
            </CustomTableCell>
            <CustomTableCell>
              <Tooltip title={editButtonTooltipTitle}>
                <div className={classes.buttonWrapper}>
                  <IconButton color="inherit" onClick={editLoading || editPostLoading ? undefined : this.handleConfirmEdit}>
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
                  {editLoading && <CircularProgress className={classes.fabProgress} />}
                  {editPostLoading && <div className={classes.postLoadingOverlay} />}
                </div>
              </Tooltip>
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
            <CustomTableCell>{item.description}</CustomTableCell>
            <CustomTableCell>
              <Tooltip title={editButtonTooltipTitle}>
                <IconButton color="inherit" onClick={this.handleEdit}>
                  <Edit color="action" />
                </IconButton>
              </Tooltip>
              <Tooltip title={deleteButtonTooltipTitle}>
                <div className={classes.buttonWrapper}>
                  <IconButton color="inherit" onClick={deleteLoading || deletePostLoading ? undefined : this.handleDelete}>
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

RoleTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  dispatchUpdateRoleOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateRoleOnServerById: (_id, roleUpdateData) => dispatch(updateRoleOnServerById(_id, roleUpdateData)),
  dispatchDeleteRoleOnServerById: _id => dispatch(deleteRoleOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(RoleTableRow));
