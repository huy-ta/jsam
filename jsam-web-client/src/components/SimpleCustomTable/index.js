import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';

import SimpleTableHead from './components/SimpleTableHead';
import SimpleTableToolbar from './components/SimpleTableToolbar';
import SimpleTableRow from './components/SimpleTableRow';

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

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

class SimpleCustomTable extends React.Component {
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
    const { classes, rows, notFoundMessage, tableTitle, rowKeyProp, columnProps, ActionComponent } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <React.Fragment>
        <SimpleTableToolbar tableTitle={tableTitle} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <colgroup>
              {columnProps.map(columnProp => (
                <col key={columnProp.id} width={columnProp.width} />
              ))}
            </colgroup>
            <SimpleTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              columnProps={columnProps}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <SimpleTableRow
                    key={row[rowKeyProp]}
                    item={row}
                    index={index}
                    columnProps={columnProps}
                    ActionComponent={ActionComponent}
                    rowKeyProp={rowKeyProp}
                  />
                ))}
              {rows.length === 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={columnProps.length}>
                    <Grid container justify="center" alignItems="center">
                      <Grid item>{notFoundMessage}</Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && rows.length > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={columnProps.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </React.Fragment>
    );
  }
}

SimpleCustomTable.defaultProps = {
  ActionComponent: () => {}
};

SimpleCustomTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columnProps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowKeyProp: PropTypes.any.isRequired,
  notFoundMessage: PropTypes.string.isRequired,
  tableTitle: PropTypes.string.isRequired,
  ActionComponent: PropTypes.any
};

export default withStyles(styles)(SimpleCustomTable);
