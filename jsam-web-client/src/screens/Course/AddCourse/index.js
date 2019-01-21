import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Section from "Shells/Section";
import AddCourseForm from "./components/AddCourseForm";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: "relative",
    overflow: "hidden",
    zIndex: 1
  }
});

// Stateless Component
const AddCourse = props => {
  const { classes } = props;
  return (
    <Section header="Courses" subheader="Add Course">
      <Paper className={classes.root}>
        <Typography variant="h6">Add Course</Typography>
        <AddCourseForm />
      </Paper>
    </Section>
  );
};

AddCourse.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddCourse);