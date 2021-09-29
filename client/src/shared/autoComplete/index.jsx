import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

import { colors } from '../../style/index';

const useStyles = makeStyles((theme) => ({
    popupIndicatorOpen: {
        transform: 'rotate(0deg)',
    },

    textFieldRoot: {
        "& > div.MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']": {
            // default paddingRight was 39px since clear icon was positioned absolute
            paddingRight: '9px',

            // Search icon
            '& button': {
                order: 2, // order 3 means the search icon will appear after the clear icon which has an order of 2
            },

            // Clear icon
            '& > div.MuiAutocomplete-endAdornment': {
                position: 'relative', // default was absolute. we make it relative so that it is now within the flow of the other two elements
                order: 3,
                // padding: '14px',
            },
        },
    },
}));
const AutoComplteStyle = styled(Autocomplete)`
    .MuiAutocomplete-clearIndicator {
        display: none;
    }
    .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'] {
        padding: 0px;
    }
    .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']
        .MuiAutocomplete-endAdornment {
        background: ${colors.purple};
        padding: 5px;
        right: 0;
        margin-left: 1px;
        border: ${colors.purple};
        height: 43px;
        display: flex;
        border-radius: 3px 0px 0px 3px;
        color: white;
    }
    .MuiIconButton-root {
        color: white;
    }
    .MuiInputBase-root {
        padding-right: 10px !important;
        color: black;
    }
`;

const TextFieldStyle = styled(TextField)`
    input {
        border: unset;
        color: black;
    }
    .MuiInputLabel-outlined {
        z-index: 1;
        transform: translate(170px, 20px) scale(1);
        pointer-events: none;
    }
    .MuiOutlinedInput-input {
        padding: 12px 0px !important;
    }
    .MuiOutlinedInput-notchedOutline {
        border-color: ${colors.purple};
    }
`;
export const AutoComplete = ({ options }) => {
    const classes = useStyles();

    return (
        <div>
            <AutoComplteStyle
                id="combo-box-demo"
                options={options}
                getOptionLabel={(option) => option.label}
                style={{ width: 300 }}
                popupIcon={<SearchIcon />}
                classes={{
                    popupIndicatorOpen: classes.popupIndicatorOpen,
                }}
                renderInput={(params) => (
                    <TextFieldStyle
                        {...params}
                        placeholder="חפש כתובת או עיר"
                        variant="outlined"
                        classes={{ root: classes.textFieldRoot }}
                    />
                )}
            />
        </div>
    );
};
