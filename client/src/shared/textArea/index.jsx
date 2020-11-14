import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../label';
import HelperText from '../helperText';

const StyledTextArea = styled(TextareaAutosize)`
    font-family: Assistant !important;
	border-radius: 14px;
	padding: 14px 14px !important;
	border: solid 1px #d1ccd5;
	background-color: #ffffff;
    color: #232323;
    font-size: 16px;
	resize: none;
    &:hover {
    	border: solid 2px #8f5de2 !important;
    }   
    &:focus {
    	border: solid 2px #8f5de2 !important;
        outline: transparent !important;
    }
`;

const TextArea = ({
	id, value, onChange, helperText, label, required,
}) => (
	<>
		{label && <Label text={label} required={required} />}
		<FormControl>
			<StyledTextArea id={id} value={value} onChange={onChange} aria-label="text-area" rowsMin={3} rowsMax={3} />
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
	id: PropTypes.string.isRequired,
	required: PropTypes.bool,
};

export default TextArea;

