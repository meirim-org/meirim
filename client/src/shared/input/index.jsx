import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import HelperText from '../helperText';
import Label from '../label';

const StyledInput = styled(TextField)`
	background-color: white;
	height: 2.75em;
	width: 24em;
	border-radius: 12px !important;
	& > div {
        border-radius: 12px !important;
		height: 2.75em;
	}
    & > div.Mui-focused > fieldset,
    & > div:hover > fieldset
    {
		border-color: ${(props) => (props.error ? '#ff3a68' : '#8f5de2 !important')} ;
        border-width: 2px;  
	}
	fieldset {
	    border-color: ${(props) => (props.error ? '#ff3a68' : 'rgba(0, 0, 0, 0.23)')}
	}
	& + p {
	    color: ${(props) => (props.error ? 'red !important' : 'rgba(0, 0, 0, 0.23)')};
	}
`;

const TextInput = ({
	helperText,
	onFocus, 
	onBlur, 
	value, 
	onChange, 
	name, 
	variant = 'outlined', 
	type, 
	label, 
	required = false, 
	size = 'small', 
	error = false 
}) =>{ 
	return (
		<>
			<Label required={required} text={label} />
			<StyledInput
				value={value}
				onChange={onChange}
				name={name}
				variant={variant}
				onFocus={() => onFocus && onFocus(name)}
				onBlur={() => onBlur && onBlur(name)}
				type={type}
				size={size}
				error={error}
			/>
			{
				helperText && <HelperText error={error} text={helperText} />
			}
		</>
	); }

TextInput.defaultProps = {
	size: 'small',
	required: false,
	helperText: '',
	label: '',
	variant: 'outlined',
	error: false,
	onBlur: {},
	onFocus: {},
};

TextInput.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	size: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	required: PropTypes.bool,
	helperText: PropTypes.string,
	label: PropTypes.string,
	variant: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.bool,
};

export default TextInput;

// const [showPassword, setShowPassword] = useState(true)

// InputProps={{
// 	endAdornment:
// 					<IconButton
// 						aria-label="toggle password visibility"
// 						onClick={handleClickShowPassword}
// 						onMouseDown={handleMouseDownPassword}
// 					>
// 						{showPassword ? <Visibility /> : <VisibilityOff />}
// 					</IconButton>,
// 	classes: {
// 		adornedEnd: classes.adornedEnd,
// 		root: classes.input
// 	}
// }}

// import IconButton from "@material-ui/core/IconButton"
// import Visibility from "@material-ui/icons/Visibility"
// import VisibilityOff from "@material-ui/icons/VisibilityOff"

// const handleClickShowPassword = () => {
// 	setShowPassword(!showPassword)
// }

// const handleMouseDownPassword = (event) => {
// 	event.preventDefault()
// }
