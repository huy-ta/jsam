import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

class PhaseSummaryTableHead extends React.Component {
  createSortHandler = property => event => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, faultList, testList } = this.props;

    const faultRows = faultList.map(fault => {
      console.log(fault);
      return {
        id: fault.id,
        placement: 'bottom-start',
        disablePadding: false,
        sortable: true,
        label: fault.name
      }
    })

    const testRows = testList.map(test => {
      console.log(test);
      return{
        id: test.id,
        placement: 'bottom-start',
        disablePadding: false,
        sortable: true,
        label: test.testName
      }
    }); 

    const rows = [
      {
        id: 'studentName',
        placement: 'bottom-start',
        disablePadding: false,
        sortable: true,
        label: 'Student Name'
      },      
      ...testRows,
      {
        id: 'averageMark',
        placement: 'bottom-start',
        disablePadding: false,
        sortable: true,
        label: 'Average Mark / 10'
      }, 
      {
        id: 'rank',
        placement: 'bottom-start',
        disablePadding: false,
        sortable: true,
        label: 'Student Rank'
      }, 
      ...faultRows
    ]

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            let sortDirection = false;
            let CustomTableCellContent = row.label;
            if (row.sortable) {
              sortDirection = orderBy === row.id ? order : false;
              CustomTableCellContent = (
                <Tooltip title="Sort" placement={row.placement} enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              );
            }

            return (
              <CustomTableCell
                key={row.id}
                numeric={row.placement === 'bottom-end'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={sortDirection}
              >
                {CustomTableCellContent}
              </CustomTableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }
}

PhaseSummaryTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  faultList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  testList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};

export default PhaseSummaryTableHead;
