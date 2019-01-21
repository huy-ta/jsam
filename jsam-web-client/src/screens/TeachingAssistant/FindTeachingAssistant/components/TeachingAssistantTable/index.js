import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import TeachingAssistantTableHead from './components/TeachingAssistantTableHead';
import TeachingAssistantTableRow from './components/TeachingAssistantTableRow';

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
  }
});

class TeachingAssistantTable extends React.Component {
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

  render() {
    const { classes, teachingAssistants } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, teachingAssistants.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <colgroup>
              <col width="20%" />
              <col width="3%" />
              <col width="20%" />
              <col width="13%" />
              <col width="13%" />
              <col width="13%" />
              <col width="13%" />
              <col width="15%" />
            </colgroup>
            <TeachingAssistantTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={teachingAssistants.length}
            />
            <TableBody>
              {stableSort(teachingAssistants, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => (
                  <TeachingAssistantTableRow key={n._id} item={n} />
                ))}
              {teachingAssistants.length === 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={9}>
                    <Grid container justify="center" alignItems="center">
                      <Grid item>No teaching assistant found.</Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && teachingAssistants.length > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={teachingAssistants.length}
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
      </Paper>
    );
  }
}

TeachingAssistantTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  teachingAssistants: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default withStyles(styles)(TeachingAssistantTable);
