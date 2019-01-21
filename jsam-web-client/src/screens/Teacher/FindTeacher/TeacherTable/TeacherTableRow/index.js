import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from "axios";

import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
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

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateTeacherOnServerById, deleteTeacherOnServerById } from 'Services/teachers/actions';

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
  }
});

let listSubject = [];

class TeacherTableRow extends React.Component {
  state = {
    editModeOn: false,
    statusDropdownOpenState: false,
    input: {}
  };

  componentWillMount = async () => {
    try {
      const subject = await axios.get("/api/subjects");
      listSubject = [...subject.data.details.Subjects];
    } catch (err) {
      listSubject = [];
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  
  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, email, facebook, 
      phone, speciality, dateOfBirth, gender } = item;

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
        email,
        facebook,
        phone,
        dateOfBirth,
        gender,
        speciality
      }
    }));
  };

  handleConfirmEdit = async() => {
    const { input } = this.state;
    const {_id,name,email,facebook,phone,dateOfBirth,gender,speciality} = input;
    let teacherUpdateData = {};
    if(speciality===''){
      teacherUpdateData = {
        name,
        email,
        facebook,
        phone,
        dateOfBirth,
        gender
      }
    }
    else{
      teacherUpdateData = {
        name,
        email,
        facebook,
        phone,
        dateOfBirth,
        gender,
        speciality
      }
    }
    console.log(teacherUpdateData);
    this.setState(() => ({ editLoading: true, editPostLoading: false }));
    try {

      const { dispatchUpdateTeacherOnServerById } = this.props;
      await dispatchUpdateTeacherOnServerById(_id, teacherUpdateData);

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
      console.log(err)
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
      const { item } = this.props;
      const { dispatchDeleteTeacherOnServerById } = this.props;
      await dispatchDeleteTeacherOnServerById(item._id);
    } catch (err) {
      console.error(err);
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
    const { classes, item, isSelected, handleClick } = this.props;

    const { editModeOn, editSuccess, editLoading, input, editPostLoading,     statusDropdownOpenState } = this.state;

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
            <CustomTableCell>
              <IconButton color="inherit" onClick={this.handleGenderChange} disabled={editLoading || editPostLoading}>
                {input.gender === 'male' ? <MaleSymbol color="primary" /> : <FemaleSymbol color="secondary" />}
              </IconButton>
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
                id="phone"
                value={input.phone}
                onChange={this.handleInputChange('phone')}    
                disabled={editLoading || editPostLoading}          
                InputProps={{
                  // ghi đè cho prop classes (inline-style)
                  classes: {
                    input: classes.resize
                  }
                }}
              />
            </CustomTableCell>               
            <CustomTableCell>
              <Select                
                open={statusDropdownOpenState}
                onClose={this.handleStatusDropdownClose}
                onOpen={this.handleStatusDropdownOpen}
                value={input.speciality}
                onChange={this.handleInputChange("speciality")}
                disabled={editLoading || editPostLoading}
                inputProps={{
                  name: "speciality",
                  id: "speciality",
                  classes: {
                    input: classes.resize
                  }
                }}
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {listSubject.map(subject => (
                  <MenuItem value={subject}>{subject.name}</MenuItem>
                ))}
              </Select>
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
            <CustomTableCell>
              {item.gender === 'male' ? (
                <div className={classes.symbol}>
                  <MaleSymbol color="primary" />
                </div>
              ) : (
                <div className={classes.symbol}>
                  <FemaleSymbol color="secondary" />
                </div>
              )}
            </CustomTableCell>
            <CustomTableCell>{item.email}</CustomTableCell>
            <CustomTableCell>
              {this.convertDateOfBirth(item.dateOfBirth)}
            </CustomTableCell>
            <CustomTableCell>{item.phone}</CustomTableCell>
            {item.speciality!==undefined?
              <CustomTableCell>{item.speciality.name}</CustomTableCell>
              :
              <CustomTableCell/>
            }
            <CustomTableCell>
              <Tooltip title="Edit">
                <IconButton color="inherit" onClick={this.handleEdit}>
                  <Edit color="action" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color="inherit" onClick={this.handleDelete}>
                  <Delete color="action" />
                </IconButton>
              </Tooltip>
            </CustomTableCell>
          </React.Fragment>
        )}
      </TableRow>
    );
  }
}

TeacherTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  dispatchUpdateTeacherOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateTeacherOnServerById: (_id, teacherUpdateData) =>
    dispatch(updateTeacherOnServerById(_id, teacherUpdateData)),
  dispatchDeleteTeacherOnServerById: _id => dispatch(deleteTeacherOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(TeacherTableRow));