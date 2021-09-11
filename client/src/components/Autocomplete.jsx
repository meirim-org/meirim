import React, { useState } from 'react';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu, InputWrapper, Input, Button } from './AutocompleteStyle';


const StyledMenuItem = withStyles(() => ({
  root: {
    fontFamily: 'Assistant',
    borderRadius: '0 0 4px 4px',
    backgroundColor: 'white',
  },
  selected: {
    backgroundColor: '#F9F9F9 !important'
  },
}))(MenuItem);


function Autocomplete(props) {
  const { placeholder, maxWidth, icon, items, onInputChange, onFilter } = props;
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState([]);

  const handleInputChange = (event) => {
    const newValue = event.target.value
    setInputValue(newValue);

    onInputChange(newValue);
  };

  const handleChange = (item) => {
    setInputValue(item.label);
    setSelectedItem(item);

    onFilter(item.label);
  };

  return (<Downshift
    inputValue={inputValue}
    selectedItem={selectedItem}
    onChange={handleChange}
    itemToString={item => (item ? item.value : '')}>
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      isOpen,
      highlightedIndex,
    }) =>
      (<div style={{ maxWidth: maxWidth, position: 'relative' }}>
        <InputWrapper>
          <Input {...getInputProps({
            onChange: handleInputChange,
            placeholder
          })} />
          <Button>{icon}</Button>
        </InputWrapper>
        {isOpen ? <Menu {...getMenuProps()}>
          {items.map((item, index) => {
            const isSelected = highlightedIndex === index;
            return (<StyledMenuItem
              key={item.label}
              selected={isSelected}
              component="li"
              {...getItemProps({ item, index })}>
              {item.label}
            </StyledMenuItem>);
          }
          )}
        </Menu> : null}
      </div>)}
  </Downshift>);
}

export default Autocomplete;
