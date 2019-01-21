import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
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

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import FindTaker from 'Screens/Test/FindTaker';
import AddTaker from 'Screens/Test/AddTaker';

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import { updateTestOnServerById, deleteTestOnServerById } from 'Services/tests/actions';

const styles = theme => ({
  root: {},
  root2: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative'
  },
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
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
});

const Transition = props => <Slide direction="up" {...props} />;
class TestTableRow extends React.Component {
  state = {
    editModeOn: false,
    editSuccess: false,
    editLoading: false,
    editPostLoading: false,
    deleteLoading: false,
    deletePostLoading: false,
    deleteSuccess: false,
    input: {},
    openDialog: false
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleEdit = () => {
    const { item } = this.props;
    const { _id, name, totalMarks } = item;

    this.setState(() => ({
      editModeOn: true,
      editSuccess: false,
      editLoading: false,
      editPostLoading: false,
      input: {
        _id,
        name,
        totalMarks
        // takers
      }
    }));
  };

  handleConfirmEdit = async () => {
    const { input } = this.state;
    const { _id } = input;
    const testUpdateData = { ...input };

    this.setState(() => ({ editLoading: true }));
    try {
      const { dispatchUpdateTestOnServerById } = this.props;
      await dispatchUpdateTestOnServerById(_id, testUpdateData);

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
      const { dispatchDeleteTestOnServerById } = this.props;
      await dispatchDeleteTestOnServerById(item._id);

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

  handleClickOpen = () => {
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  countTaker = () => {
    const { item } = this.props;
    const amountTakers = item.takers.filter(taker => taker.display);
    return amountTakers.length;
  };

  render() {
    const { classes, item, isSelected, handleClick } = this.props;

    const {
      editModeOn,
      editSuccess,
      editLoading,
      input,
      editPostLoading,
      deleteLoading,
      deletePostLoading,
      deleteSuccess,
      openDialog
    } = this.state;

    let editButtonTooltipTitle = 'Edit';
    if (editModeOn) {
      editButtonTooltipTitle = 'Confirm';
      if (editLoading) {
        editButtonTooltipTitle = 'Updating test...';
      } else if (editPostLoading) {
        if (editSuccess) {
          editButtonTooltipTitle = 'Successfully updated test';
        } else {
          editButtonTooltipTitle = 'Updating test failed';
        }
      }
    }

    let deleteButtonTooltipTitle = 'Delete';
    if (deleteLoading) {
      deleteButtonTooltipTitle = 'Deleting test...';
    } else if (deletePostLoading) {
      if (deleteSuccess) {
        deleteButtonTooltipTitle = 'Successfully deleted test';
      } else {
        deleteButtonTooltipTitle = 'Deleting test failed';
      }
    }

    const ViewRow = () => (
      <React.Fragment>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="body1">{item.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{item.totalMarks}</Typography>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </React.Fragment>
    );

    return (
      <TableRow hover role="checkbox" aria-checked={isSelected} tabIndex={-1} key={item._id} selected={isSelected}>
        <CustomTableCell padding="checkbox">
          <Checkbox checked={isSelected} color="primary" onClick={event => handleClick(event, item._id)} />
        </CustomTableCell>
        <CustomTableCell>{item.name}</CustomTableCell>
        <CustomTableCell>{item.totalMarks}</CustomTableCell>
        <CustomTableCell>{item.takers.length}</CustomTableCell>
        <CustomTableCell>
          <Tooltip title={editButtonTooltipTitle}>
            <IconButton color="inherit" variant="outlined" onClick={this.handleClickOpen}>
              <Edit color="action" />
            </IconButton>
          </Tooltip>
        </CustomTableCell>
        <CustomTableCell>
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

        <React.Fragment>
          <Dialog fullScreen open={openDialog} onClose={this.handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.flex}>
                  Takers
                </Typography>
                <Button color="inherit" onClick={this.handleClose}>
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <Paper className={classes.root2}>
              <Typography variant="h6">Test details</Typography>
              {editModeOn ? (
                <React.Fragment>
                  <Grid container spacing={24}>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="totalMarks"
                        value={input.totalMarks}
                        onChange={this.handleInputChange('totalMarks')}
                        disabled={editLoading || editPostLoading}
                        InputProps={{
                          classes: {
                            input: classes.resize
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                        <IconButton
                          color="inherit"
                          onClick={this.handleCancelEdit}
                          disabled={editLoading || editPostLoading}
                        >
                          <Cancel color={editLoading || editPostLoading ? 'disabled' : 'action'} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ) : (
                <ViewRow />
              )}
            </Paper>
            <AddTaker idTest={item._id} />
            <FindTaker takers={item.takers} idTest={item._id} />
          </Dialog>
        </React.Fragment>
      </TableRow>
    );
  }
}

TestTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  dispatchUpdateTestOnServerById: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateTestOnServerById: (_id, testUpdateData) => dispatch(updateTestOnServerById(_id, testUpdateData)),
  dispatchDeleteTestOnServerById: _id => dispatch(deleteTestOnServerById(_id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(TestTableRow));
