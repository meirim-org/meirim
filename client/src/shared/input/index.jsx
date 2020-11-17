import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import HelperText from '../helperText';
import Label from '../label';
import {Link} from 'react-router-dom';


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
    & > div:hover > fieldset,
    & > .Mui-error > fieldset
    {
		border-color: ${(props) => (props.error ? '#ff3a68' : '#8f5de2 !important')} ;
        border-width: 2px !important;  
	}
	fieldset {
	    border-color: ${(props) => (props.error ? '#ff3a68' : 'rgba(0, 0, 0, 0.23)')};
	}
	& + p {
	    color: ${(props) => (props.error ? 'red !important' : 'rgba(0, 0, 0, 0.23)')};
	}
	input[type] {
	    font-family: Assistant !important;
        color: #232323;
        font-size: 16px;
        border: 0;
    }
    .label-row {
 
    }
    
`;

const ForgotPassword = styled.div`
      text-align: left;
        a {
          margin-bottom: 0.5rem;
          font-family: Assistant;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #51465e;
        }
`;

const TextInput = ({
	id, helperText, onFocus, onBlur, value, onChange, name, variant = 'outlined', type, label, required = false, size = 'small', error = false, forgetPassword = false
}) => {

	return (
		<>
			<Label id={`${id}-label`} required={required} text={label}/>
			<StyledInput
				id={id}
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
				helperText && <HelperText id={`${id}-helperText`} error={error} text={helperText}/>
			}
			{
				forgetPassword && <ForgotPassword>
					<u><Link to='/forgot-password'>שכחתי סיסמה</Link></u>
				</ForgotPassword>
			}
		</>
	);
}

TextInput.defaultProps = {
	size: 'small',
	required: false,
	helperText: '',
	label: '',
	variant: 'outlined',
	error: false,
	onFocus: () => {
	},
	onBlur: () => {
	}
};

TextInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	size: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	required: PropTypes.bool,
	helperText: PropTypes.string,
	label: PropTypes.string,
	variant: PropTypes.string,
	error: PropTypes.bool,
	forgetPassword: PropTypes.bool,
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

