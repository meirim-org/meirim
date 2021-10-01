import React, { useState } from 'react';

import styled from 'styled-components';

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

export const FilterButton = ({ label, color, dot, name }) => {
    const [category, setCategory] = useState(() => [name]);
    const handleClick = (e, neWcategory) => {
        setCategory(neWcategory);
    };
    console.log('click', category);
    return (
        <ToggleButtonGroup
            value={category}
            onChange={handleClick}
            aria-label="text formatting"
        >
            <StyleToggleButton value={name} aria-label="bold" color={color}>
                <FiberManualRecordIcon />
                {label}
            </StyleToggleButton>
        </ToggleButtonGroup>
    );
};

const StyleToggleButton = styled(ToggleButton)`
    :focus {
        outline: none;
        /* border: 1px solid ${(props) => props.color}; */
    }
    .Mui-selected {
        border: 1px solid ${(props) => props.color};
    }
    margin: 0 0 0 10px !important;
    border-color: 1px solid green;
    svg {
        color: ${(props) => props.color};
    }
`;
