import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PhaseSummaryTableHead from './components/PhaseSummaryTableHead';
import PhaseSummaryTableRow from './components/PhaseSummaryTableRow';

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

class PhaseSummaryTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: ''
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
    const { classes, faultList, testList, phaseSummary, isLoading } = this.props;
    const { order, orderBy } = this.state;

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
            <Typography variant="body1">Loading phase summary please wait...</Typography>
          </Grid>
        </Grid>
      );
    }

    const rows = [     
      ...testList,
      ...faultList
    ]

    return (
      <React.Fragment>
        {isLoading ? (
          <Loading />
        ) : (
            <React.Fragment>
              <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <colgroup>                   
                    {
                      rows.map(row =>
                        rows.indexOf(row) === 0 
                        ?
                        <col width='20%' />
                        :
                        <col width={`${80 / rows.length}%`} />
                      )
                    }
                  </colgroup>
                  <PhaseSummaryTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort} faultList={faultList}
                  testList={testList}/>
                  <TableBody>
                    {stableSort(phaseSummary, getSorting(order, orderBy))
                      .map(n => (
                        <PhaseSummaryTableRow summary={n} />
                      ))}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
}

PhaseSummaryTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  faultList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  testList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  phaseSummary: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles)(PhaseSummaryTable);
