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
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import MaleSymbol from '@material-ui/icons/CallMade';
import FemaleSymbol from '@material-ui/icons/CallReceived';
import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateStudentOnServerById, deleteStudentOnServerById } from 'Services/students/actions';

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
    top: -10,
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

class StudentTableRow extends React.Component {
  state = {
    editModeOn: false,
    editSuccess: false,
    editLoading: false,
    editPostLoading: false,
    deleteLoading: false,
    deletePostLoading: false,
    deleteSuccess: false,
    input: {},
    statusDropdownOpen: false
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpen: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpen: true });
  };

  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, gender, school, phone, status } = item;

    this.setState(() => ({
      editModeOn: true,
      editSuccess: false,
      editLoading: false,
      editPostLoading: false,
      input: {
        _id,
        name,
        gender,
        school,
        phone: {
          self: phone.self,
          parent: phone.parent
        },
        status: status._id
      }
    }));
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const { statusList } = this.props;
    const { _id } = input;
    let studentUpdateData = { ...input };

    const statusId = studentUpdateData.status;
    const foundStatus = statusList.filter(status => status._id === statusId)[0];
    studentUpdateData.status = foundStatus;

    this.setState(() => ({ editLoading: true }));
    try {
      const { dispatchUpdateStudentOnServerById } = this.props;
      await dispatchUpdateStudentOnServerById(_id, studentUpdateData);

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

  handleGenderChange = () => {
    const { input } = this.state;
    let inputTemp = { ...input };
    inputTemp.gender = inputTemp.gender === 'male' ? 'female' : 'male';
    this.setState(() => ({ input: inputTemp }));
  };

  handleDelete = async () => {
    try {
      this.setState(() => ({ deleteLoading: true }));
      const { item } = this.props;
      const { dispatchDeleteStudentOnServerById } = this.props;
      await dispatchDeleteStudentOnServerById(item._id);

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
    const { classes, item, isSelected, handleClick, statusList } = this.props;
    const {
      editModeOn,
      editSuccess,
      editLoading,
      input,
      editPostLoading,
      deleteLoading,
      deletePostLoading,
      deleteSuccess,
      statusDropdownOpen
    } = this.state;

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating student...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated student';
        } else {
          editButtonTooltipTitle = 'Updating student failed';
        }
      }
    }

    let deleteButtonTooltipTitle = 'Delete';
    if (deleteLoading) {
      deleteButtonTooltipTitle = 'Deleting student...';
    } else if (deletePostLoading) {
      if (deleteSuccess) {
        deleteButtonTooltipTitle = 'Successfully deleted student';
      } else {
        deleteButtonTooltipTitle = 'Deleting student failed';
      }
    }

    const ViewRow = () => (
      <React.Fragment>
        <CustomTableCell>{item.name}</CustomTableCell>
        <CustomTableCell>{item.code}</CustomTableCell>
        <CustomTableCell>
          <Tooltip title={item.gender === 'male' ? 'Male' : 'Female'}>
            {item.gender === 'male' ? (
              <div className={classes.symbol}>
                <MaleSymbol color="primary" />
              </div>
            ) : (
              <div className={classes.symbol}>
                <FemaleSymbol color="secondary" />
              </div>
            )}
          </Tooltip>
        </CustomTableCell>
        <CustomTableCell>{item.school}</CustomTableCell>
        <CustomTableCell>{item.phone.self}</CustomTableCell>
        <CustomTableCell>{item.phone.parent}</CustomTableCell>
        <CustomTableCell>{item.status.name || ''}</CustomTableCell>
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
    );

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={item._id}
        selected={editModeOn || isSelected}
      >
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
            <CustomTableCell>{item.code}</CustomTableCell>
            <CustomTableCell>
              <Tooltip title={input.gender === 'male' ? 'Male' : 'Female'}>
                <IconButton color="inherit" onClick={this.handleGenderChange} disabled={editLoading || editPostLoading}>
                  {input.gender === 'male' ? <MaleSymbol color="primary" /> : <FemaleSymbol color="secondary" />}
                </IconButton>
              </Tooltip>
            </CustomTableCell>
            <CustomTableCell>
              <TextField
                id="school"
                value={input.school}
                onChange={this.handleInputChange('school')}
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
                id="self-phone"
                value={input.phone.self}
                onChange={this.handleInputChange('phone.self')}
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
                id="parent-phone"
                value={input.phone.parent}
                onChange={this.handleInputChange('phone.parent')}
                disabled={editLoading || editPostLoading}
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
              />
            </CustomTableCell>
            <CustomTableCell>
              <FormControl className={classes.resize} fullWidth disabled={editLoading || editPostLoading}>
                <Select
                  className={classes.resize}
                  open={statusDropdownOpen}
                  onClose={this.handleStatusDropdownClose}
                  onOpen={this.handleStatusDropdownOpen}
                  value={input.status}
                  onChange={this.handleInputChange('status')}
                  inputProps={{
                    name: 'status',
                    id: 'status',
                    className: classes.resize
                  }}
                >
                  <MenuItem className={classes.resize} value="">
                    <em>None</em>
                  </MenuItem>
                  {statusList.map(status => (
                    <MenuItem className={classes.resize} key={status._id} value={status._id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CustomTableCell>
            <CustomTableCell>
              <Tooltip title={editButtonTooltipTitle}>
                <div className={classes.buttonWrapper}>
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
          <ViewRow />
        )}
      </TableRow>
    );
  }
}

StudentTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  statusList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  dispatchUpdateStudentOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateStudentOnServerById: (_id, studentUpdateData) =>
    dispatch(updateStudentOnServerById(_id, studentUpdateData)),
  dispatchDeleteStudentOnServerById: _id => dispatch(deleteStudentOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(StudentTableRow));
