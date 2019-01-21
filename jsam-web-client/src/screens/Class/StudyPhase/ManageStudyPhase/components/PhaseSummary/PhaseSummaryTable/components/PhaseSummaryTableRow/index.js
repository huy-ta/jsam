import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';
import CustomTableCell from 'GlobalComponents/CustomTableCell';

const styles = () => ({
  root: {}
});

const PhaseSummaryTableRow = props => {

  const { classes, summary } = props;


  return (  
    <TableRow className={classes.root} hover role="checkbox" tabIndex={-1}>   
      <React.Fragment>
        <CustomTableCell>
          {summary.name}
        </CustomTableCell>
        {summary.tests.map(test => 
          <CustomTableCell>
            {test.testMark}
          </CustomTableCell>
        )}
        <CustomTableCell>
          {summary.averageMark}
        </CustomTableCell>
        <CustomTableCell>
          {summary.rank}
        </CustomTableCell>
        {summary.faults.map(fault =>
          <CustomTableCell>
            {fault.count}
          </CustomTableCell>
        )}
      </React.Fragment>            
    </TableRow>      
  )
};

PhaseSummaryTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  summary: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default withStyles(styles)(PhaseSummaryTableRow);
