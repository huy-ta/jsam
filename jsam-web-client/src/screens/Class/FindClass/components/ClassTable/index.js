import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ClassTableHead from './components/ClassTableHead';
import ClassTableToolbar from './components/ClassTableToolbar';
import ClassTableRow from './components/ClassTableRow';

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
  order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  table: {},
  tableWrapper: {
    overflowX: 'auto'
  },
  loadingContainer: {
    padding: theme.spacing.unit * 2
  }
});

class ClassTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    page: 0,
    rowsPerPage: 5
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    const { orderBy: stateOrderBy, order: stateOrder } = this.state;
    if (stateOrderBy === property && stateOrder === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, studentClasses, isLoading } = this.props;

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
            <Typography variant="body1">Loading student classes, please wait...</Typography>
          </Grid>
        </Grid>
      );
    }

    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, studentClasses.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        {isLoading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <ClassTableToolbar />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <colgroup>
                  <col width="42%" />
                  <col width="43%" />
                  <col width="15%" />
                </colgroup>
                <ClassTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort} />
                <TableBody>
                  {stableSort(studentClasses, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(row => (
                      <ClassTableRow key={row._id} item={row} />
                    ))}
                  {studentClasses.length === 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={8}>
                        <Grid container justify="center" alignItems="center">
                          <Grid item>No student class found.</Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && studentClasses.length > 0 && (
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
              count={studentClasses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
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

ClassTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  studentClasses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles)(ClassTable);
