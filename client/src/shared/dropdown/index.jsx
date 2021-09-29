/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React, { useRef, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../label';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Input,
    InputLabel,
    makeStyles,
} from '@material-ui/core';
import { Button } from 'shared';

const StyledSelect = styled(Select)`
    font-family: Assistant !important;
    width: 100%;
    font-size: 16px;
    background-color: white;
    border-radius: ${(props) =>
        props.borderRadios ? props.borderRadios : '12px !important'};
    > svg {
        left: 0.2em;
        right: auto;
    }
    > div {
        background-color: transparent !important;
    }
    &.Mui-focused > fieldset,
    &:hover > fieldset {
        border-width: 2px;
        border-color: #8f5de2 !important;
    }
`;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}));

const Dropdown = ({
    // onChange,
    value,
    id,
    options,
    label,
    borderRadios,
    placeholder,
    icon,
    multiple,
    checkbox,
}) => {
    const [chosen, setChosen] = useState([]);
    // const [state, setState] = useState();
    const [state, setState] = React.useState(options);
    const classes = useStyles();
    // const checkRef = useRef();
    // const onChange = (e) => {
    //     console.log('chose', e);
    //     const arr = [];
    //     if (e.target.value.includes(1)) {
    //         options.map((item) => arr.push(item.value));
    //         setChosen(arr);
    //         // if (e.target.value[0] !== 1) {
    //         //     chosen.filter((item) => (item[0] = 1));
    //         // }
    //     } else {
    //         setChosen(e.target.value);
    //     }
    //     // console.log(checkRef);
    // };
    const handleChange = (event) => {
        // console.log(event.target.name);
        // console.log(event.target.checked);

        for (let index = 0; index < state.length; index++) {
            if (state[index].text == event.target.name) {
                console.log('sxsx', state[index].isChecked);
                // setState([state,{state[index].isChecked : true}]);
            }
        }
        // setState({
        //     ...state,
        //     [state[event.target.value].isChecked]: event.target.checked,
        // });
        // console.log(state);
        console.log(state);
    };
    // const onClick = () => {
    //     setState(chosen);
    // };
    // const handleReset = () => {
    //     setChosen(null);
    //     setState(null);
    // };
    // console.log('value', chosen);

    return (
        <>
            {label && <Label text={label} id={`${id}-label`} />}
            <FormControl className={classes.formControl}>
                <StyledSelect
                    variant="outlined"
                    value={chosen}
                    id={id}
                    // onChange={onChange}
                    borderRadios={borderRadios}
                    IconComponent={icon}
                    multiple={multiple}
                    labelId={`${id}-label`}
                    displayEmpty
                    renderValue={
                        chosen.length > 0
                            ? (chosen) => `לפי נושא (${chosen.length})`
                            : () => placeholder
                    }
                >
                    <FormGroup>
                        {options.map((optn, i) => (
                            <MenuItem key={optn.value} value={optn.value}>
                                {checkbox && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={handleChange}
                                                checked={state[i].isChecked}
                                                name={optn.text}
                                            />
                                        }
                                    />
                                )}
                                {optn.text}
                            </MenuItem>
                        ))}
                    </FormGroup>
                    {multiple && (
                        <div>
                            {/* <Button text={'החל'} onClick={onClick} />{' '}
                            <Button onClick={handleReset} text={'איפוס'} /> */}
                        </div>
                    )}
                </StyledSelect>
            </FormControl>
        </>
    );
};

Dropdown.defaultProps = {
    label: '',
};
Dropdown.propTypes = {
    label: PropTypes.string,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    borderRadios: PropTypes.string,
    icone: PropTypes.element,
    multiple: PropTypes.bool,
    checkbox: PropTypes.bool,
};

export default Dropdown;
