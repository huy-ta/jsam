/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import CustomTableCell from 'GlobalComponents/CustomTableCell';
import ReactSuggestSelectChip from 'GlobalComponents/ReactSuggestSelectChip';

const styles = () => ({
  root: {}
});

const StudentTableRow = props => {
  const [isPresent, setIsPresent] = useState(false);
  const [faults, setFaults] = useState(null);
  const { classes, item, index, faults: faultList, session } = props;

  const faultSuggestions = faultList.map(fault => ({
    value: fault._id,
    label: fault.name,
    ...fault
  }));

  useEffect(() => {
    const foundStudentAttendance = session.attendance.students.filter(
      student => student.studentId._id === item.studentId._id
    )[0];
    if (foundStudentAttendance.faults) {
      setFaults(
        faultSuggestions.filter(faultSuggestion => foundStudentAttendance.faults.includes(faultSuggestion._id))
      );
    }
    setIsPresent(foundStudentAttendance.present);
  }, []);

  const handlePresentChange = async e => {
    const { checked } = e.target;
    setIsPresent(checked);
    try {
      await axios.put(`/api/study-sessions/${session._id}/attendance/students/${item.studentId._id}`, {
        present: checked
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFaultChange = async newFaults => {
    setFaults(newFaults);
    const faultIds = newFaults.map(newFault => newFault._id);
    try {
      await axios.put(`/api/study-sessions/${session._id}/attendance/students/${item.studentId._id}`, {
        faults: faultIds
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TableRow className={classes.root} hover role="checkbox" tabIndex={-1} key={item._id}>
      <CustomTableCell>{index + 1}</CustomTableCell>
      <CustomTableCell>{item.studentId.name}</CustomTableCell>
      <CustomTableCell>{item.studentId.code}</CustomTableCell>
      <CustomTableCell>{item.studentId.school}</CustomTableCell>
      <CustomTableCell>
        <FormControlLabel
          control={<Checkbox checked={isPresent} onChange={handlePresentChange} value="isPresent" color="primary" />}
          label="Present"
        />
      </CustomTableCell>
      <CustomTableCell>
        <ReactSuggestSelectChip
          value={faults}
          suggestions={faultSuggestions}
          onChange={handleFaultChange}
          placeholder="Select faults"
        />
      </CustomTableCell>
    </TableRow>
  );
};

StudentTableRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  item: PropTypes.shape({}).isRequired,
  faults: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default withStyles(styles)(StudentTableRow);
