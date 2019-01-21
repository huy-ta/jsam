/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1300
  },
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: theme.typography.body1.fontSize
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: theme.typography.body1.fontSize
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

const NoOptionsMessage = props => {
  const { selectProps, innerProps, children } = props;

  return (
    <Typography color="textSecondary" className={selectProps.classes.noOptionsMessage} {...innerProps}>
      {children}
    </Typography>
  );
};

const inputComponent = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />;

const Control = props => {
  const { selectProps, innerProps, innerRef, children } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: selectProps.classes.input,
          inputRef: innerRef,
          children,
          ...innerProps
        }
      }}
      {...selectProps.textFieldProps}
    />
  );
};

const Option = props => {
  const { innerRef, isFocused, isSelected, innerProps, children } = props;

  return (
    <MenuItem
      buttonRef={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
};

const Placeholder = props => {
  const { selectProps, innerProps, children } = props;

  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
};

const MultiValue = props => {
  const { children, selectProps, removeProps, isFocused } = props;

  return (
    <Chip
      tabIndex={-1}
      label={children}
      className={classNames(selectProps.classes.chip, {
        [selectProps.classes.chipFocused]: isFocused
      })}
      onDelete={removeProps.onClick}
      deleteIcon={<CancelIcon {...removeProps} />}
    />
  );
};

const ValueContainer = props => {
  const { selectProps, children } = props;

  return <div className={selectProps.classes.valueContainer}>{children}</div>;
};

const Menu = props => {
  const { selectProps, innerProps, children } = props;

  return (
    <Paper square className={selectProps.classes.paper} {...innerProps}>
      {children}
    </Paper>
  );
};

const customComponents = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  MultiValue,
  ValueContainer
};

const ReactSuggestSelectChip = props => {
  const { classes, theme, placeholder, suggestions, value, onChange } = props;

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    })
  };

  return (
    <div className={classes.root}>
      <Select
        classes={classes}
        styles={selectStyles}
        textFieldProps={{
          InputLabelProps: {
            shrink: true
          }
        }}
        options={suggestions}
        components={customComponents}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isMulti
      />
    </div>
  );
};

ReactSuggestSelectChip.defaultProps = {
  value: null
};

ReactSuggestSelectChip.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  theme: PropTypes.shape({}).isRequired,
  placeholder: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  value: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(ReactSuggestSelectChip);
