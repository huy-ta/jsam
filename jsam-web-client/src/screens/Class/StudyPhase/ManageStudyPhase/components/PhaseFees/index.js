import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import StudentTableHead from './components/StudentTableHead';
import StudentTableRow from './components/StudentTableRow';

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
    marginTop: 0
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    position: 'relative'
  },
  table: {},
  tableWrapper: {
    overflowX: 'auto'
  },
  loadingContainer: {
    padding: theme.spacing.unit * 2
  }
});

class StudentTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: '',
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
    const { classes, phase, show } = this.props;

    if (show) {
      const { order, orderBy, rowsPerPage, page } = this.state;
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, phase.students.length - page * rowsPerPage);

      return (
        <Paper className={classes.paper}>
          <Typography variant="h6">Phase Student Fees</Typography>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <colgroup>
                <col width="5%" />
                <col width="15%" />
                <col width="10%" />
                <col width="30%" />
                <col width="35%" />
              </colgroup>
              <StudentTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort} />
              <TableBody>
                {stableSort(phase.students, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <StudentTableRow key={row.studentId} item={row} phase={phase} index={index} />
                  ))}
                {phase.students.length === 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={8}>
                      <Grid container justify="center" alignItems="center">
                        <Grid item>No student found.</Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && phase.students.length > 0 && (
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
            count={phase.students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      );
    }

    return null;
  }
}

StudentTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired,
  show: PropTypes.bool.isRequired
};

export default withStyles(styles)(StudentTable);
