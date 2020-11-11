import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../label';
import HelperText from '../helperText';

const StyledTextArea = styled(TextareaAutosize)`
	border-radius: 14px;
	border: solid 1px #d1ccd5;
	background-color: #ffffff;
	resize: none;
    &:hover {
        border-color: #8f5de2 !important;
    }   
    &:focus {
        outline-color: #8f5de2 !important;
    }
`;

const TextArea = ({
	value, onChange, helperText, label, required,
}) => (
	<>
		{label && <Label text={label} required={required} />}
		<FormControl>
			<StyledTextArea value={value} onChange={onChange} aria-label="text-area" rowsMin={4} rowsMax={4} />
			{
				helperText && <HelperText text={helperText} />
			}
		</FormControl>
	</>
);

TextArea.defaultProps = {
	label: '',
	helperText: '',
	required: false,
};

TextArea.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	helperText: PropTypes.string,
	required: PropTypes.bool,
};

export default TextArea;
