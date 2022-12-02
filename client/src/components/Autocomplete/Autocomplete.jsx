import React, { useState } from 'react';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { Wrapper, Menu, InputWrapper, Input, Button } from './style';
import { colors } from 'style';

const StyledMenuItem = withStyles({
    root: {
        borderRadius: '0 0 4px 4px',
        backgroundColor: colors.white,
    },
    selected: {
        backgroundColor: `${colors.grey[300]} !important`,
    },
})(MenuItem);

function Autocomplete(props) {
    const { placeholder, width, icon, items, onInputChange, onFilter } = props;
    const [inputValue, setInputValue] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);

        onInputChange(newValue);
    };

    const handleChange = (item) => {
        setInputValue(item.label);
        setSelectedItem(item);

        onFilter(item.label);
    };

    return (
        <Downshift
            inputValue={inputValue}
            selectedItem={selectedItem}
            onChange={handleChange}
            itemToString={(item) => (item ? item.value : '')}
        >
            {({
                getRootProps,
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                highlightedIndex,
            }) => (
                <Wrapper width={width} {...getRootProps()}>
                    <InputWrapper>
                        <Input
                            {...getInputProps({
                                onChange: handleInputChange,
                                placeholder,
                            })}
                        />
                        <Button>{icon}</Button>
                    </InputWrapper>
                    {isOpen ? (
                        <Menu {...getMenuProps()}>
                            {items.map((item, index) => {
                                const isSelected = highlightedIndex === index;
                                return (
                                    <StyledMenuItem
                                        key={item.label}
                                        selected={isSelected}
                                        component="li"
                                        {...getItemProps({ item, index })}
                                    >
                                        {item.label}
                                    </StyledMenuItem>
                                );
                            })}
                        </Menu>
                    ) : null}
                </Wrapper>
            )}
        </Downshift>
    );
}

export default Autocomplete;
