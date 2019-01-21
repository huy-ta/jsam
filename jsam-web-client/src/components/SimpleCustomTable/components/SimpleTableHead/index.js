import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

class SimpleTableHead extends React.Component {
  createSortHandler = property => event => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, columnProps } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnProps.map(columnProp => {
            let sortDirection = false;
            let CustomTableCellContent = columnProp.label;
            if (columnProp.sortable) {
              sortDirection = orderBy === columnProp.id ? order : false;
              CustomTableCellContent = (
                <Tooltip title="Sort" placement={columnProp.placement} enterDelay={300} key={columnProp.id}>
                  <TableSortLabel
                    active={orderBy === columnProp.id}
                    direction={order}
                    onClick={this.createSortHandler(columnProp.id)}
                  >
                    {columnProp.label}
                  </TableSortLabel>
                </Tooltip>
              );
            }

            return (
              <CustomTableCell
                key={columnProp.id}
                numeric={columnProp.placement === 'bottom-end'}
                padding={columnProp.disablePadding ? 'none' : 'default'}
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

SimpleTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  columnProps: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default SimpleTableHead;
