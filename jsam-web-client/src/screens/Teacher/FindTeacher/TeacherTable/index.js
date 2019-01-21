import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TeacherTableHead from './TeacherTableHead';
import TeacherTableToolbar from './TeacherTableToolBar';
import TeacherTableRow from './TeacherTableRow';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

class TeacherTable extends React.Component {  

  state = {
    order: 'asc',
    orderBy: 'calories',
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleSelectAllClick = event => {
    const { teachers } = this.props;
    if (event.target.checked) {
      this.setState(() => ({ selected: teachers.map(n => n._id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    // nếu chưa có trong mảng select(chưa được chọn) thì thêm vào
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } 
    // xét trường hợp nằm ở đầu
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } 
    // xét trường hợp nằm ở cuối
    else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } 
    // nếu element đã có trong mảng => loại khỏi mảng 
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    this.setState({ selected: newSelected });
  };

  isSelected = id => {
    const { selected } = this.state;
    return selected.indexOf(id) !== -1;
  };

  render(){
    const { classes, teachers } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = 
    rowsPerPage - Math.min(rowsPerPage, teachers.length - page * rowsPerPage);

    return(
      <Paper className={classes.root}>
        <TeacherTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <colgroup>
              <col width="2%" />
              <col width="20%" />
              <col width="2%" />
              <col width="20%" />
              <col width="10%" />
              <col width="14%" />
              <col width="17%" />
              <col width="15%" />
            </colgroup>
            <TeacherTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={teachers.length}
            />
            <TableBody>
              {stableSort(teachers, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => (
                  <TeacherTableRow item={n} isSelected={this.isSelected(n._id)} handleClick={this.handleClick} />
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={teachers.length}
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
    )
  }
}

TeacherTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  teachers: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default withStyles(styles)(TeacherTable);