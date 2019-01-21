import { withStyles } from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';

const CustomTableCell = withStyles(theme => ({
  root: {
    padding: `4px 4px 4px ${theme.spacing.unit}px`
  }
}))(TableCell);

export default CustomTableCell;
