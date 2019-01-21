import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from "axios";
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

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import AutoSuggestChipInput from 'GlobalComponents/AutoSuggestChipInput';
import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateCourseOnServerById, deleteCourseOnServerById } from 'Services/courses/actions';
import { fetchSubjectsToReduxStore } from 'Services/subjects/actions';

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
  },
  formControl: {}
});

class CourseTableRow extends React.Component {
  state = {
    editModeOn: false,
    editSuccess: false,
    editLoading: false,
    editPostLoading: false,
    deleteLoading: false,
    deletePostLoading: false,
    deleteSuccess: false,
    input: {},
    statusDropdownOpenStateSubject: false,
    classList: [],
    suggestions: []
  };

  handleEdit = async () => {
    const { item } = this.props;
    let tempItem = item;

    let subject = tempItem.subject._id;
    let classNames = tempItem.classes.map(clas => clas.name);
    let classes = tempItem.classes.map(clas => clas._id);
    let {_id, name} = tempItem;

    try {
      const { dispatchFetchSubjectsToReduxStore } = this.props;
      await dispatchFetchSubjectsToReduxStore();

      const resClasses = await axios.get("/api/classes");
      this.setState(() => ({
        suggestions: resClasses.data.details.classes
      }));
    }
    catch (err) {
      console.log(err);
    }

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
        subject,
        classes,
        classNames
      }
    }));


    const { input } = this.state;
    console.log("input handleEdit");
    console.log(input);

    console.log("item handleEdit");
    console.log(item);
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const courseUpdateData = {
      name: input.name,
      subject: input.subject,
      classes: input.classes
    }

    console.log("courseData handleConfirmEdit");
    console.log(courseUpdateData);

    this.setState(() => ({ editLoading: true, editPostLoading: false }));
    try {
      const { dispatchUpdateCourseOnServerById } = this.props;
      await dispatchUpdateCourseOnServerById(input._id, courseUpdateData);

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

    console.log("input handleConfirmEdit");
    console.log(input);

    const {item} = this.props;
    console.log("item handleConfirmEdit");
    console.log(item);

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

    console.log("input handleInputChange");
    console.log(input);

    const {item} = this.props;
    console.log("item handleInputChange");
    console.log(item);
  };

  handleDelete = async () => {
    try {
      this.setState(() => ({ deleteLoading: true }));
      const { item } = this.props;
      const { dispatchDeleteCourseOnServerById } = this.props;
      await dispatchDeleteCourseOnServerById(item._id);

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

  handleStatusDropdownCloseSubject = () => {
    this.setState({ statusDropdownOpenStateSubject: false });
  };

  handleStatusDropdownOpenSubject = () => {
    this.setState({ statusDropdownOpenStateSubject: true });
  };

  handleAddClass = chipValue => {
    const { classList, suggestions, input } = this.state;
    let tempInput = input;
    suggestions.forEach(clas => {
      if (clas.name === chipValue) {
        tempInput.classes = [...tempInput.classes, clas._id]
        tempInput.classNames = [...tempInput.classNames, clas.name]
      }
    })
    let tempClassList = classList;
    tempClassList = [...tempClassList, chipValue];
    this.setState({
      classList: tempClassList,
      input: tempInput
    });

    console.log("input handleAddClass");
    console.log(input);
  };

  handleDeleteClass = index => {
    const { classList, input } = this.state;
    const tempClassList = classList;
    const tempInput = input;
    tempClassList.splice(index, 1);
    tempInput.classes.splice(index, 1);
    tempInput.classNames.splice(index, 1);
    this.setState({
      classList: tempClassList,
      input: tempInput
    });
  };

  render() {
    const { classes, item, subjects } = this.props;

    console.log("item");
    console.log(item);

    const {
      editModeOn,
      editSuccess,
      editLoading,
      input,
      editPostLoading,
      deleteLoading,
      deletePostLoading,
      deleteSuccess,
      statusDropdownOpenStateSubject,
      classList,
      suggestions
    } = this.state;

    const classSuggestions = suggestions.filter(
      suggestion => !classList.includes(suggestion.name)
    )

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating course...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated course';
        } else {
          editButtonTooltipTitle = 'Updating course failed';
        }
      }
    }

    let deleteButtonTooltipTitle = 'Delete';
    if (deleteLoading) {
      deleteButtonTooltipTitle = 'Deleting course...';
    } else if (deletePostLoading) {
      if (deleteSuccess) {
        deleteButtonTooltipTitle = 'Successfully deleted course';
      } else {
        deleteButtonTooltipTitle = 'Deleting course failed';
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
              <FormControl className={classes.formControl} fullWidth>
                <Select
                  open={statusDropdownOpenStateSubject}
                  onClose={this.handleStatusDropdownCloseSubject}
                  onOpen={this.handleStatusDropdownOpenSubject}
                  value={input.subject}
                  disabled={editLoading || editPostLoading}
                  onChange={this.handleInputChange('subject')}
                  inputProps={{
                    name: 'subject',
                    id: 'subject',
                    classes: {
                      input: classes.resize
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {subjects.map(subject => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CustomTableCell>
            <CustomTableCell>
              <AutoSuggestChipInput
                suggestions={classSuggestions}
                fullWidth
                chipValues={input.classNames}
                handleAddChipToForm={this.handleAddClass}
                handleRemoveChipFromForm={this.handleDeleteClass}
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
              <CustomTableCell>{item.subject.name}</CustomTableCell>
              <CustomTableCell>
                {item.classes.map(clas => (
                  <TableRow>
                    {clas.name}
                  </TableRow>
                ))}
              </CustomTableCell>
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

CourseTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  subjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchUpdateCourseOnServerById: PropTypes.func.isRequired,
  dispatchFetchSubjectsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ subjects }) => ({ subjects });

const mapDispatchToProps = dispatch => ({
  dispatchUpdateCourseOnServerById: (_id, courseUpdateData) =>
    dispatch(updateCourseOnServerById(_id, courseUpdateData)),
  dispatchDeleteCourseOnServerById: _id => dispatch(deleteCourseOnServerById(_id)),
  dispatchFetchSubjectsToReduxStore: () => dispatch(fetchSubjectsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CourseTableRow));