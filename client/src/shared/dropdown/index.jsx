/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import HelperText from '../helperText';
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
    &.Mui-error > fieldset,
    &.Mui-focused > fieldset,
    &:hover > fieldset {
        border-width: 2px;
        border-color: ${(props) => (props.error ? '#ff3a68' : '#8f5de2 !important')} ;
    }
    & + p {
        color: ${(props) => (props.error ? 'red !important' : 'rgba(0, 0, 0, 0.23)')};
    }
`;

const Dropdown = ({ onChange, value, id, options, label, helperText, error, required = false, onBlur, onFocus }) => {

	return (
		<>
			{label && <Label text={label} id={`${id}-label`} required={required} />}
			<StyledSelect
				variant="outlined"
				value={value}
				id={id}
				onChange={onChange}
				error={error}
				onFocus={onFocus}
				onBlur={onBlur}
			>
				{
					options.map((optn) => <MenuItem key={optn.value} value={optn.value}>{optn.text}</MenuItem>)
				}
			</StyledSelect>
			{
				helperText && <HelperText id={`${id}-helperText`} error={error} text={helperText}/>
			}
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
	helperText: PropTypes.string,
	error: PropTypes.bool,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	required: PropTypes.bool
};

export default Dropdown;

