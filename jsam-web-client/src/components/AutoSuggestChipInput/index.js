import React from 'react';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Autosuggest from 'react-autosuggest';

import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 2
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit * 0.5,
    left: 0,
    right: 0,
    zIndex: 99
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  textField: {
    width: '100%'
  },
  highestOrder: {
    zIndex: 998
  }
});

const renderInput = inputProps => {
  const { classes, value, onChange, onAdd, onDelete, chips, ref, ...rest } = inputProps;

  return (
    <ChipInput
      clearInputValueOnChange
      onUpdateInput={onChange}
      onDelete={onDelete}
      value={chips}
      inputRef={ref}
      {...rest}
    />
  );
};

const renderSuggestionsContainer = options => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

class AutoSuggest extends React.Component {
  state = {
    filteredSuggestions: [],
    textFieldInput: ''
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    const { classes } = this.props;

    return (
      <MenuItem selected={isHighlighted} component="div" className={classes.highestOrder}>
        <div>
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            )
          )}
        </div>
      </MenuItem>
    );
  };

  getFilteredSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { suggestions, chipValues } = this.props;

    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.name.toLowerCase().slice(0, inputLength) === inputValue &&
            !chipValues.includes(suggestion.name);

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  getSuggestionDisplayValue = suggestion => suggestion.name;

  handleSuggestionsFetchRequested = ({ value, reason }) => {
    if (reason !== 'suggestion-selected') {
      this.setState(() => ({
        filteredSuggestions: this.getFilteredSuggestions(value)
      }));
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState(() => ({
      filteredSuggestions: []
    }));
  };

  handleTextFieldInputChange = (e, { newValue }) => {
    this.setState(() => ({
      textFieldInput: newValue
    }));
  };

  handleAddChip = chipValue => {
    const { filteredSuggestions } = this.state;
    const { handleAddChipToForm } = this.props;

    const isValid = filteredSuggestions.some(filteredSuggestion => filteredSuggestion.name === chipValue);
    if (isValid) {
      handleAddChipToForm(chipValue);
    }
  };

  handleDeleteChip = (chipValue, index) => {
    const { handleRemoveChipFromForm } = this.props;
    handleRemoveChipFromForm(index);
  };

  shouldRenderSuggestions = value => value.trim().length >= 1;

  render() {
    const { classes, chipValues, handleAddChipToForm, handleRemoveChipFromForm, ...rest } = this.props;
    const { filteredSuggestions, textFieldInput } = this.state;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={filteredSuggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        getSuggestionValue={this.getSuggestionDisplayValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={(e, { suggestionValue }) => {
          e.preventDefault();
          this.handleAddChip(suggestionValue);
        }}
        focusInputOnSuggestionClick={false}
        inputProps={{
          classes,
          chips: chipValues,
          value: textFieldInput,
          onChange: this.handleTextFieldInputChange,
          onDelete: this.handleDeleteChip,
          ...rest
        }}
      />
    );
  }
}

AutoSuggest.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleAddChipToForm: PropTypes.func.isRequired,
  handleRemoveChipFromForm: PropTypes.func.isRequired,
  chipValues: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withStyles(styles)(AutoSuggest);
