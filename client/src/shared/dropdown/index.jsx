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
	border-radius: 12px !important;
	> svg {
		left: 0.2em;
		right: auto;
	}
	> div {
        background-color: transparent !important;
	}
    &.Mui-focused > fieldset,
    &:hover > fieldset
     {
        border-width: 2px;
		border-color: #8f5de2 !important;
	}
`;

const Dropdown = ({ onChange, value, id, options, label }) => {

	return (
		<>
			{label && <Label text={label} id={`${id}-label`}/>}
			<StyledSelect
				variant="outlined"
				value={value}
				id={id}
				onChange={onChange}
			>
				{
					options.map((optn) => <MenuItem key={optn.value} value={optn.value}>{optn.text}</MenuItem>)
				}
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
};

export default Dropdown;

