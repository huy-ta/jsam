import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

const styles = () => ({
  root: {}
});

const SimpleTableRow = props => {
  const { classes, item, columnProps, ActionComponent, rowKeyProp, index } = props;
  return (
    <TableRow className={classes.root} hover tabIndex={-1}>
      {columnProps.map(columnProp => {
        if (columnProp.id === 'actions') {
          return (
            <CustomTableCell key={columnProp.id}>
              <ActionComponent selectedItemId={item[rowKeyProp]} />
            </CustomTableCell>
          );
        }
        if (columnProp.id === 'index') {
          return <CustomTableCell key={columnProp.id}>{index + 1}</CustomTableCell>;
        }
        return <CustomTableCell key={columnProp.id}>{item[columnProp.id]}</CustomTableCell>;
      })}
    </TableRow>
  );
};

SimpleTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  columnProps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  ActionComponent: PropTypes.any.isRequired,
  rowKeyProp: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default withStyles(styles)(SimpleTableRow);
