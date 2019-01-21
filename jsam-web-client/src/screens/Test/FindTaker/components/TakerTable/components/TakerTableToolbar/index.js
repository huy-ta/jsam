import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.primary.contrastText
  },
  title: {
    flex: '0 0 auto'
  },
  buttonWrapper: {
    position: 'relative',
    display: 'inline'
  },
  fabProgress: {
    position: 'absolute',
    top: -12,
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
    color: green[300]
  }
});

class TakerTableToolbar extends React.Component {
  state = {
    bulkDeleteLoading: false,
    bulkDeletePostLoading: false,
    bulkDeleteSuccess: false
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleClickBulkDelete = async () => {
    this.setState(() => ({ bulkDeleteLoading: true }));

    try {
      const { handleBulkDelete } = this.props;
      await handleBulkDelete();

      this.setState(() => ({
        bulkDeleteLoading: false,
        bulkDeletePostLoading: true,
        bulkDeleteSuccess: true
      }));
      this.timer = setTimeout(() => {
        this.setState(() => ({
          bulkDeletePostLoading: false,
          bulkDeleteSuccess: false
        }));
      }, 1000);
    } catch (err) {
      this.setState(() => ({
        bulkDeleteLoading: false,
        bulkDeletePostLoading: true,
        bulkDeleteSuccess: false
      }));
      this.timer = setTimeout(() => {
        this.setState(() => ({
          bulkDeletePostLoading: false,
          bulkDeleteSuccess: false
        }));
      }, 3000);
    }
  };

  render() {
    const {
      bulkDeleteLoading,
      bulkDeletePostLoading,
      bulkDeleteSuccess
    } = this.state;
    const { numSelected, classes } = this.props;

    let bulkDeleteTooltipTitle = 'Delete selected tests';
    if (bulkDeleteLoading) {
      bulkDeleteTooltipTitle = 'Deleting tests...';
    } else if (bulkDeletePostLoading) {
      if (bulkDeleteSuccess) {
        bulkDeleteTooltipTitle = 'Successfully deleted tests';
      } else {
        bulkDeleteTooltipTitle = "Couldn't delete tests";
      }
    }

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} test(s) selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Taker List
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 && (
            <Tooltip title={bulkDeleteTooltipTitle}>
              <div className={classes.buttonWrapper}>
                <IconButton
                  color="inherit"
                  onClick={
                    bulkDeleteLoading || bulkDeletePostLoading
                      ? undefined
                      : this.handleClickBulkDelete
                  }
                >
                  {bulkDeletePostLoading ? (
                    (() => {
                      if (bulkDeleteSuccess) {
                        return <CheckIcon className={classes.successIcon} />;
                      }
                      return <ErrorIcon color="error" />;
                    })()
                  ) : (
                    <DeleteIcon color="inherit" />
                  )}
                </IconButton>
                {bulkDeleteLoading && (
                  <CircularProgress
                    className={classes.fabProgress}
                    color="inherit"
                  />
                )}
                {bulkDeletePostLoading && (
                  <div className={classes.postLoadingOverlay} />
                )}
              </div>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  }
}

TakerTableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  numSelected: PropTypes.number.isRequired,
  handleBulkDelete: PropTypes.func.isRequired
};

export default withStyles(styles)(TakerTableToolbar);
