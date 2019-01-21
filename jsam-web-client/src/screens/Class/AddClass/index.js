import React from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';
import axios from 'axios';
import _ from 'lodash';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

import Section from 'Shells/Section';

import AddOrUpdateClass from '../AddOrUpdateClass';

// FIXME: This screen needs serious refactoring (Lift state up)

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative'
  }
});

const checkIfAllObjectPropertiesEmpty = obj => {
  let isAllPropertiesEmpty = true;
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== '') {
      isAllPropertiesEmpty = false;
    }
  });
  return isAllPropertiesEmpty;
};

class CreateClass extends React.Component {
  state = {
    shouldBlockNavigation: false
  };

  componentWillUnmount() {
    this.unblockNavigation();
  }

  unblockNavigation = () => {
    this.setState(() => ({ shouldBlockNavigation: false }));
    window.onbeforeunload = undefined;
  };

  blockNavigation = () => {
    this.setState(() => ({ shouldBlockNavigation: true }));
    window.onbeforeunload = () => true;
  };

  handleNavigationBlock = classInfo => {
    if (_.isEmpty(classInfo)) {
      this.unblockNavigation();
      return false;
    }

    if (checkIfAllObjectPropertiesEmpty(classInfo)) {
      this.unblockNavigation();
      return false;
    }

    this.blockNavigation();
    return true;
  };

  handleAddClass = async requestPayload => {
    try {
      const response = await axios.post('/api/classes', requestPayload);

      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  render() {
    const { classes } = this.props;
    const { shouldBlockNavigation } = this.state;

    return (
      <React.Fragment>
        <Prompt when={shouldBlockNavigation} message="You have unsaved changes, are you sure you want to leave?" />
        <Section header="Class" subheader="Add Class">
          <Paper className={classes.root}>
            <AddOrUpdateClass
              handleSubmit={this.handleAddClass}
              handleNavigationBlock={this.handleNavigationBlock}
              mode="add"
            />
          </Paper>
        </Section>
      </React.Fragment>
    );
  }
}

CreateClass.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateClass);
