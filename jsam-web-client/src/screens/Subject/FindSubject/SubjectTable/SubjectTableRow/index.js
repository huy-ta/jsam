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
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateSubjectOnServerById, deleteSubjectOnServerById } from 'Services/subjects/actions';

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

class SubjectTableRow extends React.Component {
  state = {
    editModeOn: false,
    input: {}
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, teachers } = item;

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
        teachers
      }
    }));
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const { _id, name } = input;

    const subjectUpdateData = {
      name
    };
    this.setState(() => ({ editLoading: true, editPostLoading: false }));
    try {
      const { dispatchUpdateSubjectOnServerById } = this.props;
      await dispatchUpdateSubjectOnServerById(_id, subjectUpdateData);

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
      const { item } = this.props;
      const { dispatchDeleteSubjectOnServerById } = this.props;
      await dispatchDeleteSubjectOnServerById(item._id);
    } catch (err) {
      console.error(err);
    }
  };

  convertDateOfBirth = dateOfBirth => {
    if (dateOfBirth) {
      let array = [];
      array = dateOfBirth.split('T');
      return array[0];
    }
  };

  render() {
    const { classes, item, isSelected, handleClick } = this.props;

    const { editModeOn, editSuccess, editLoading, input, editPostLoading } = this.state;

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating subject...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated subject';
        } else {
          editButtonTooltipTitle = 'Updating subject failed';
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
              {item.teachers.map(teacher => (
                <React.Fragment key={teacher._id}>
                  <div className={classes.detailTeacher}>
                    <Grid container className={classes.root} spacing={16}>
                      <Grid item xs={4}>
                        {teacher.name}
                      </Grid>
                      <Grid item xs={4}>
                        {teacher.email}
                      </Grid>
                      <Grid item xs={4}>
                        {this.convertDateOfBirth(teacher.dateOfBirth)}
                      </Grid>
                    </Grid>
                  </div>
                  {item.teachers.indexOf(teacher) !== item.teachers.length - 1 ? <Divider /> : <React.Fragment />}
                </React.Fragment>
              ))}
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
              {item.teachers.map(teacher => (
                <React.Fragment>
                  <div className={classes.detailTeacher}>
                    <Grid container className={classes.root} spacing={16}>
                      <Grid item xs={4}>
                        {teacher.name}
                      </Grid>
                      <Grid item xs={4}>
                        {teacher.email}
                      </Grid>
                      <Grid item xs={4}>
                        {this.convertDateOfBirth(teacher.dateOfBirth)}
                        {/* {teacher.dateOfBirth} */}
                      </Grid>
                    </Grid>
                  </div>
                  {item.teachers.indexOf(teacher) !== item.teachers.length - 1 ? <Divider /> : <React.Fragment />}
                </React.Fragment>
              ))}
            </CustomTableCell>
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

SubjectTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  dispatchUpdateSubjectOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateSubjectOnServerById: (_id, subjectUpdateData) =>
    dispatch(updateSubjectOnServerById(_id, subjectUpdateData)),
  dispatchDeleteSubjectOnServerById: _id => dispatch(deleteSubjectOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(SubjectTableRow));
