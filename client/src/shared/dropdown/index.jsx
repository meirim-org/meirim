/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../label';

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

const Dropdown = ({
    onChange,
    value,
    id,
    options,
    label,
    borderRadios,
    placeholder,
    icon,
    multiple,
}) => {
    const [personName, setPersonName] = React.useState([]);

    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        console.log(options);
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setPersonName(value);
    };
    return (
        <>
            {label && <Label text={label} id={`${id}-label`} />}
            <StyledSelect
                variant="outlined"
                value={multiple ? personName : value}
                id={id}
                onChange={multiple ? handleChangeMultiple : onChange}
                borderRadios={borderRadios}
                IconComponent={icon}
                multiple={multiple}
            >
                {placeholder && (
                    <MenuItem disabled value={''}>
                        {placeholder}
                    </MenuItem>
                )}
                {options.map((optn) => (
                    <MenuItem key={optn.value} value={optn.value}>
                        {optn.text}
                    </MenuItem>
                ))}
            </StyledSelect>
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
};

export default Dropdown;
