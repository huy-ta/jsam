import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from "axios";

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
import MaleSymbol from '@material-ui/icons/CallMade';
import FemaleSymbol from '@material-ui/icons/CallReceived';
import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateTeachingAssistantOnServerById, deleteTeachingAssistantOnServerById } from 'Services/teachingAssistants/actions';

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

let listRole = [];

class TeachingAssistantTableRow extends React.Component {
  state = {
    editModeOn: false,
    editSuccess: false,
    editLoading: false,
    editPostLoading: false,
    deleteLoading: false,
    deletePostLoading: false,
    deleteSuccess: false,
    input: {},
    statusDropdownOpenState: false
  };

  componentWillMount = async() => {
    try{ 
      const roles =await axios.get("/api/roles");    
      listRole = [...roles.data.details.roles];
      listRole = listRole.filter(role => ((role.name === "Student Manager") || (role.name === "Student Helper")));
    }catch(err){
      listRole = [];
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, gender, role, dateOfBirth, email, facebook, phone } = item;

    this.setState(() => ({
      editModeOn: true,
      editSuccess: false,
      editLoading: false,
      editPostLoading: false,
      input: {
        _id,
        name,
        gender,
        role,
        dateOfBirth, 
        email, 
        facebook,
        phone
      }
    }));
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const { _id, name, gender, role, dateOfBirth, email, facebook, phone } = input;
    const roleId = role._id;
    const teachingAssistantUpdateData =  {
      name,
      gender, 
      roleId,
      dateOfBirth, 
      email, 
      facebook, 
      phone
    } ;
    this.setState(() => ({ editLoading: true }));
    try {
      const { dispatchUpdateTeachingAssistantOnServerById } = this.props;
      await dispatchUpdateTeachingAssistantOnServerById(_id, teachingAssistantUpdateData);
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
    let inputTemp = input;
    inputTemp[prop] = value;
    this.setState(() => ({ input: inputTemp }));
  };

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpenState: true });
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
      const { dispatchDeleteTeachingAssistantOnServerById } = this.props;
      await dispatchDeleteTeachingAssistantOnServerById(item._id);

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

  convertDateOfBirth = dateOfBirth => {
    if (dateOfBirth !== undefined) {
      let array = [];
      array = dateOfBirth.split('T');
      return array[0];
    }
  }

  render() {
    const { classes, item, isSelected } = this.props;
    const {
      editModeOn,
      editSuccess,
      editLoading,
      input,
      editPostLoading,
      deleteLoading,
      deletePostLoading,
      deleteSuccess,
      statusDropdownOpenState
    } = this.state;

    console.log(input);

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating teaching assistant...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated teaching assistant';
        } else {
          editButtonTooltipTitle = 'Updating teaching assistant failed';
        }
      }
    }

    let deleteButtonTooltipTitle = 'Delete';
    if (deleteLoading) {
      deleteButtonTooltipTitle = 'Deleting teaching assistant...';
    } else if (deletePostLoading) {
      if (deleteSuccess) {
        deleteButtonTooltipTitle = 'Successfully deleted teaching assistant';
      } else {
        deleteButtonTooltipTitle = 'Deleting teaching assistant failed';
      }
    }

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={item._id}
        selected={editModeOn || isSelected}
      >
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
              <Tooltip title={input.gender === 'male' ? 'Male' : 'Female'}>
                <IconButton color="inherit" onClick={this.handleGenderChange} disabled={editLoading || editPostLoading}>
                  {input.gender === 'male' ? <MaleSymbol color="primary" /> : <FemaleSymbol color="secondary" />}
                </IconButton>
              </Tooltip>
            </CustomTableCell>
            <CustomTableCell>
              <Select                
                open={statusDropdownOpenState}
                onClose={this.handleStatusDropdownClose}
                onOpen={this.handleStatusDropdownOpen}
                value={input.role}
                onChange={this.handleInputChange("role")}
                disabled={editLoading || editPostLoading}
                inputProps={{
                  name: "role",
                  id: "role",
                  classes: {
                    input: classes.resize
                  }
                }}
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {listRole.map(role => (
                  <MenuItem value={role}>{role.name}</MenuItem>
                ))}
              </Select>
            </CustomTableCell>
            <CustomTableCell>
              <TextField
                id="date"
                type="date"
                defaultValue={this.convertDateOfBirth(item.dateOfBirth)}
                className={classes.textField}
                onChange={this.handleInputChange("dateOfBirth")}
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
                fullWidth
              />
            </CustomTableCell>
            <CustomTableCell>
              <TextField
                id="email"
                value={input.email}
                onChange={this.handleInputChange('email')}
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
                id="facebook"
                value={input.phone.parent}
                onChange={this.handleInputChange('facebook')}
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
                id="phone"
                value={input.phone}
                onChange={this.handleInputChange('phone')}    
                disabled={editLoading || editPostLoading}          
                InputProps={{
                  classes: {
                    input: classes.resize
                  }
                }}
              />
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
          <React.Fragment>
            <CustomTableCell>{item.name}</CustomTableCell>
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
            <CustomTableCell>{item.role.name}</CustomTableCell>
            <CustomTableCell>{this.convertDateOfBirth(item.dateOfBirth)}</CustomTableCell>
            <CustomTableCell>{item.email}</CustomTableCell>
            <CustomTableCell>{item.facebook}</CustomTableCell>
            <CustomTableCell>{item.phone}</CustomTableCell>
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

TeachingAssistantTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  dispatchUpdateTeachingAssistantOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateTeachingAssistantOnServerById: (_id, teachingAssistantUpdateData) =>
    dispatch(updateTeachingAssistantOnServerById(_id, teachingAssistantUpdateData)),
  dispatchDeleteTeachingAssistantOnServerById: _id => dispatch(deleteTeachingAssistantOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(TeachingAssistantTableRow));
