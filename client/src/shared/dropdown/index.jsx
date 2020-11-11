/* eslint-disable react/forbid-prop-types */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../label';

const StyledSelect = styled(Select)`
	background-color: white;
	border-radius: 12px !important;
	& > svg {
		left: 0.2em;
		right: auto;
	}
`;

const Dropdown = ({
	options, label, required, value, onChange,
}) => (
	<>
		{label && <Label required={required} text={label} />}
		<StyledSelect
			required={required}
			variant="outlined"
			value={value}
			onChange={onChange}
		>
			{
				options.map((optn) => <MenuItem key={optn.value} value={optn.value}>{optn.text}</MenuItem>)
			}
		</StyledSelect>
	</>
);

Dropdown.defaultProps = {
	label: '',
	required: false,
};

Dropdown.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	required: PropTypes.bool,
	options: PropTypes.array.isRequired,
};

export default Dropdown;
