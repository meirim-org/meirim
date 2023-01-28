import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';

import Downshift from 'downshift';
import '../FilterAutoCompleteMultiple.css';

import styled from 'styled-components';

const AutocompleteWrapper = styled.div`
  .MuiPaper-elevation1 {
    display: block !important;
    position: absolute;
    min-width: 136px;
    border: 1px solid #652dd0;
    border-radius: 0px 0px 8px 8px;
    z-index: 10000;
  }
  @media (max-width: 767px) {
    .MuiPaper-elevation1 {
      min-width: 110px !important;
    }
  }
`;

function renderInput(inputProps) {
  const { InputProps, classes, ref, loading, disable, ...other } = inputProps;

  return (
    <>
      <TextField
        type="number"
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          },
          disabled: disable,
          ...InputProps,
        }}
        {...other}
      />
      {loading && <LinearProgress />}
    </>
  );
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.id) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        fontFamily: 'Assistant',
      }}
    >
      {suggestion.parcel}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ id: PropTypes.string }).isRequired,
};

class AutocompleteInput extends Component {
  state = {
    inputValue: this.props.value,
    selectedItem: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.value === 0 && prevProps.value > 0) {
      this.setState({
        inputValue: '',
      });
    }
  }

  handleKeyDown = (event) => {
    const { onFilterChange } = this.props;
    let { inputValue, selectedItem } = this.state;

    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === 'Backspace'
    ) {
      selectedItem.splice(selectedItem.length - 1, 1);

      this.setState({
        selectedItem,
      });

      onFilterChange(selectedItem);
    }
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
    const { onInputChange } = this.props;

    onInputChange(event.target.value);
  };

  handleChange = (item) => {
    const { onFilterChange } = this.props;
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [item];
    }

    this.setState({
      inputValue: selectedItem[0],
    });

    onFilterChange(selectedItem[0]);
  };

  getSuggestions(value) {
    const { inputSuggestions } = this.props;
    return inputSuggestions;
  }

  render() {
    const { classes, placeholder, id, loading, disable } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container} id={id}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItem.map((item) => <div>{item}</div>),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder,
              }),
              loading,
              disable,
            })}
            {isOpen ? (
              <AutocompleteWrapper>
                <Paper className={classes.paper} square>
                  {this.getSuggestions(inputValue2).map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({
                        item: suggestion.parcel,
                      }),
                      highlightedIndex,
                      selectedItem: selectedItem2,
                    })
                  )}
                </Paper>
              </AutocompleteWrapper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

export default AutocompleteInput;