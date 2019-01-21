import React from 'react';
import { connect } from 'react-redux';
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

import { bulkDeleteTakersOnServerByIds } from 'Services/tests/actions';

import TakerTableHead from './components/TakerTableHead';
import TakerTableToolbar from './components/TakerTableToolbar';
import TakerTableRow from './components/TakerTableRow';

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

class TakerTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: '',
    selected: [],
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

  handleSelectAllClick = event => {
    const { takers } = this.props;
    if (event.target.checked) {
      this.setState(() => ({
        selected: takers.map(n => n.studentId)
      }));
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
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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
    const { idTest } = this.props;
    const { dispatchBulkDeleteTakersOnServerByIds } = this.props;
    try {
      await dispatchBulkDeleteTakersOnServerByIds(idTest, selected);
      this.setState(() => ({ selected: [] }));
    } catch (err) {
      throw new Error('Deleting takers failed.');
    }
  };

  render() {
    const { classes, takers, isLoading, idTest } = this.props;
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
            <Typography variant="body1">Loading takers, please wait...</Typography>
          </Grid>
        </Grid>
      );
    }

    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, takers.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        {isLoading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <TakerTableToolbar numSelected={selected.length} handleBulkDelete={this.handleBulkDelete} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <colgroup>
                  <col width="2%" />
                  <col width="27%" />
                  <col width="28%" />
                  <col width="27%" />
                  <col width="16%" />
                </colgroup>
                <TakerTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={takers.length}
                />
                <TableBody>
                  {stableSort(takers, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(taker => (
                      <TakerTableRow
                        key={taker.studentId}
                        item={taker}
                        idTest={idTest}
                        isSelected={this.isSelected(taker.studentId)}
                        handleClick={this.handleClick}
                      />
                    ))}
                  {takers.length === 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={8}>
                        <Grid container justify="center" alignItems="center">
                          <Grid item>No taker found.</Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && takers.length > 0 && (
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
              count={takers.length}
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

TakerTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  idTest: PropTypes.string.isRequired,
  takers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool.isRequired,
  dispatchBulkDeleteTakersOnServerByIds: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  dispatchBulkDeleteTakersOnServerByIds: (idTest, _ids) => dispatch(bulkDeleteTakersOnServerByIds(idTest, _ids))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(TakerTable));
