import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import Fuse from "fuse.js";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import Section from "Shells/Section";
import { fetchRolesToReduxStore } from "Services/roles/actions";

import RoleTable from "./components/RoleTable";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: "relative",
    overflow: "hidden"
  }
});

// Stateless Component
class FindRole extends React.Component {
  state = {
    searchInput: "",
    isLoading: false
  };

  async componentDidMount() {
    const { dispatchFetchRolesToReduxStore } = this.props;
    this.setState(() => ({ isLoading: true }));
    await dispatchFetchRolesToReduxStore();
    this.setState(() => ({ isLoading: false }));
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = roles => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name", "description"]
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(roles, options); // "list" is the item array
    return fuse.search(searchInput);
  };

  render() {
    const { classes, roles } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredRoleList = roles;
    if (searchInput.length > 1) {
      filteredRoleList = this.fuse(roles);
    }

    return (
      <Section header="Roles" subheader="Find Role">
        <Paper className={classes.root}>
          <Typography variant="h6">Find Role</Typography>
          <TextField
            id="search-input"
            label="Search info"
            value={searchInput}
            onChange={this.handleSearchInputChange}
            fullWidth
          />
        </Paper>
        <RoleTable roles={filteredRoleList} isLoading={isLoading} />
      </Section>
    );
  }
}

FindRole.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchRolesToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ roles }) => ({ roles });

const mapDispatchToProps = dispatch => ({
  dispatchFetchRolesToReduxStore: () => dispatch(fetchRolesToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindRole));
