import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

const rows = [
  {
    id: 'index',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: '#'
  },
  {
    id: 'studentName',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Name'
  },
  {
    id: 'studentId',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Student Id'
  },
  {
    id: 'paidFee',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Paid Fee'
  },
  {
    id: 'feeToPay',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Fee to Pay'
  }
];

class StudentTableHead extends React.Component {
  createSortHandler = property => event => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

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

StudentTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};

export default StudentTableHead;
