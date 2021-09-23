import React from 'react';
import { FilterBoxWrapper, Chip } from './FilterBox.styled';

function FilterBox(props) {
    const { label, selected, chipColor, onToggle } = props;
    return (<FilterBoxWrapper selected={selected} onClick={onToggle}>
        <Chip fillColor={chipColor} />
        {label}
    </FilterBoxWrapper>)
};

export default FilterBox