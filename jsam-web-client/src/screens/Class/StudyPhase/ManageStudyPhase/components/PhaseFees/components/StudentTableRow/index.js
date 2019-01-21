/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import CustomTableCell from 'GlobalComponents/CustomTableCell';

const styles = () => ({
  root: {}
});

const StudentTableRow = props => {
  const { classes, item, index, phase } = props;
  const [paidFee, setPaidFee] = useState('');

  useEffect(() => {
    if (item.paidFee) {
      setPaidFee(item.paidFee);
    }
  }, []);

  const handlePaidFeeChange = async e => {
    const { value: newValue } = e.target;
    if (/^[-+]?(?:[0-9]+,)*[0-9]+$/.test(newValue)) {
      setPaidFee(newValue);
      if (newValue.length > 6 || newValue.length === 0) {
        await axios.put(`/api/study-phases/${phase._id}/students/${item.studentId}`, {
          paidFee: parseInt(newValue.replace(',', ''), 10)
        });
      }
    }
  };

  return (
    <TableRow className={classes.root} hover role="checkbox" tabIndex={-1} key={item._id}>
      <CustomTableCell>{index + 1}</CustomTableCell>
      <CustomTableCell>{item.studentName}</CustomTableCell>
      <CustomTableCell>{item.studentCode}</CustomTableCell>
      <CustomTableCell>
        <TextField
          label="Paid fee"
          value={paidFee}
          onChange={handlePaidFeeChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">VND</InputAdornment>
          }}
        />
      </CustomTableCell>
      <CustomTableCell>{phase.phaseFee} VND</CustomTableCell>
    </TableRow>
  );
};

StudentTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  phase: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(StudentTableRow);
