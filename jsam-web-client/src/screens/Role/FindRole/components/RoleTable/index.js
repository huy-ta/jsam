import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { bulkDeleteRolesOnServerByIds } from "Services/roles/actions";

import RoleTableHead from "./components/RoleTableHead";
import RoleTableToolbar from "./components/RoleTableToolbar";
import RoleTableRow from "./components/RoleTableRow";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) =>
  order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  table: {},
  tableWrapper: {
    overflowX: "auto"
  },
  loadingContainer: {
    padding: theme.spacing.unit * 2
  }
});

class RoleTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "calories",
    selected: [],
    page: 0,
    rowsPerPage: 5
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    const { orderBy: stateOrderBy, order: stateOrder } = this.state;
    if (stateOrderBy === property && stateOrder === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    const { roles } = this.props;
    if (event.target.checked) {
      this.setState(() => ({ selected: roles.map(n => n._id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState(() => ({ selected: newSelected }));
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => {
    const { selected } = this.state;
    return selected.indexOf(id) !== -1;
  };

  handleBulkDelete = async () => {
    const { selected } = this.state;
    const { dispatchBulkDeleteRolesOnServerByIds } = this.props;
    try {
      await dispatchBulkDeleteRolesOnServerByIds(selected);
      this.setState(() => ({ selected: [] }));
    } catch (err) {
      throw new Error("Deleting roles failed.");
    }
  };

  render() {
    const { classes, roles, isLoading } = this.props;

    let Loading;
    if (isLoading) {
      Loading = () => (
        <Grid
          container
          className={classes.loadingContainer}
          spacing={24}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Loading roles, please wait...
            </Typography>
          </Grid>
        </Grid>
      );
    }

    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, roles.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        {isLoading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <RoleTableToolbar
              numSelected={selected.length}
              handleBulkDelete={this.handleBulkDelete}
            />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <colgroup>
                  <col width="2%" />
                  <col width="20%" />
                  <col width="63%" />
                  <col width="15%" />
                </colgroup>
                <RoleTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={roles.length}
                />
                <TableBody>
                  {stableSort(roles, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => (
                      <RoleTableRow
                        key={n._id}
                        item={n}
                        isSelected={this.isSelected(n._id)}
                        handleClick={this.handleClick}
                      />
                    ))}
                  {roles.length === 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={8}>
                        <Grid container justify="center" alignItems="center">
                          <Grid item>No role found.</Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && roles.length > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={roles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": "Previous Page"
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page"
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </React.Fragment>
        )}
      </Paper>
    );
  }
}

RoleTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool.isRequired,
  dispatchBulkDeleteRolesOnServerByIds: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchBulkDeleteRolesOnServerByIds: _ids =>
    dispatch(bulkDeleteRolesOnServerByIds(_ids))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(RoleTable));
