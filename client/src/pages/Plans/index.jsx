import React, { useState } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { AutoComplete } from 'shared/autoComplete';
import { Dropdown } from 'shared';
import styled from 'styled-components';
import { FilterButton } from '../../shared/filterButton';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
const locations = [{ label: 'תל אביב' }, { label: 'ירושלים' }];
const optionsForSelect = [
    { value: 1, text: 'כל הקטגוריות' },
    { value: 2, text: 'טבע, חופים וים' },
    { value: 3, text: 'מוסדות ציבור' },
    { value: 4, text: 'מלונאות' },
];
const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
    selected1: {
        borderColor: '#AE7FF0',
    },
    selected2: {
        // borderColor: '#1976D2',
        border: '1px solid #1976D2',
        borderLeft: '1px solid #1976D2',
    },
});
export const Plans = () => {
    const classes = useStyles();
    const [category, setCategory] = useState(() => []);
    const handleClick = (e, neWcategory) => {
        setCategory(neWcategory);
    };
    console.log(category);

    return (
        <Container>
            <AutoComplete options={locations} />
            {/* <FilterButton
                variant="outlined"
                dot
                color={'#AE7FF0'}
                label={' בתהליך'}
                name={'inProsses'}
            ></FilterButton>
            <FilterButton
                variant="outlined"
                dot
                color={'#1976D2'}
                label={'מאושרות'}
                name={'approved'}
            ></FilterButton> */}
            <StyleGroupToggle
                value={category}
                onChange={handleClick}
                aria-label="text formatting"
            >
                <StyleToggleButton
                    value={'inProsses'}
                    aria-label="bold"
                    color={'#AE7FF0'}
                    classes={{ selected: classes.selected1 }}
                >
                    <FiberManualRecordIcon />
                    {' בתהליך'}
                </StyleToggleButton>
                <StyleToggleButton
                    value={'approved'}
                    aria-label="bold"
                    color={'#1976D2'}
                    classes={{ selected: classes.selected2 }}
                >
                    <FiberManualRecordIcon />
                    {'מאושרות'}
                </StyleToggleButton>
            </StyleGroupToggle>
            <Dropdown
                options={optionsForSelect}
                borderRadios={'4px'}
                placeholder={'לפי נושא'}
                icon={ExpandMore}
                multiple={true}
            />
        </Container>
    );
};
const StyleToggleButton = styled(ToggleButton)`
    border: 1px solid;
    border-radius: 4x;
    .MuiToggleButtonGroup-groupedHorizontal:not(:first-child) {
        /* border-top-left-radius: 0; */
        /* border-bottom-left-radius: 0; */
        border-radius: 4px !important;
    }
    :focus {
        outline: none;
    }
    margin: 10px !important;
    svg {
        color: ${(props) => props.color};
    }
`;
const StyleGroupToggle = styled(ToggleButtonGroup)`
    .MuiToggleButtonGroup-groupedHorizontal:not(:first-child) {
        border-radius: 4px;
        border-left: 1px solid #1976d2;
    }
    .MuiToggleButtonGroup-groupedHorizontal:not(:last-child) {
        border-radius: 4px;
    }

    .MuiToggleButton-root.Mui-selected + .MuiToggleButton-root.Mui-selected {
        border-left: 1px solid #1976d2;
        background-color: unset;
    }
    .MuiToggleButton-root.Mui-selected {
        color: rgba(0, 0, 0, 0.54);
        background-color: unset;
    }
`;
