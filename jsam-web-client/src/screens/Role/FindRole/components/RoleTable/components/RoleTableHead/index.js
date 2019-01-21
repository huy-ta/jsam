import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

const rows = [
  {
    id: 'name',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Name'
  },
  {
    id: 'description',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: true,
    label: 'Description'
  },
  {
    id: 'actions',
    placement: 'bottom-start',
    disablePadding: false,
    sortable: false,
    label: ''
  }
];

class RoleTableHead extends React.Component {
  createSortHandler = property => event => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <CustomTableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 ? numSelected === rowCount : false}
              disabled={rowCount === 0}
              onChange={onSelectAllClick}
              color="primary"
            />
          </CustomTableCell>
          {rows.map(row => {
            let sortDirection = false;
            let CustomTableCellContent = row.label;
            if (row.sortable) {
              sortDirection = orderBy === row.id ? order : false;
              CustomTableCellContent = (
                <Tooltip
                  title="Sort"
                  placement={row.placement}
                  enterDelay={300}
                >
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

RoleTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default RoleTableHead;
