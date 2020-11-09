import React from "react"
import TextField from "@material-ui/core/TextField"
import PropTypes from "prop-types"
import styled from "styled-components"
import { HelperText, Label } from "../"

const StyledInput = styled(TextField)`
	background-color: white;
	height: 2.75em;
	width: 24em;
	border-radius: 12px !important;
	& > div {
		border-radius: 12px !important;
		height: 2.75em;
	}
`

const TextInput = ({helperText, name, variant = "outlined", type, label, required = false, size = "small"}) => {

	return (
		<>
			<Label required={required} text={label} />
			<StyledInput
				name={name}
				variant={variant}
				type={type}
				size={size}
			/>
			{ 
				helperText && <HelperText text={helperText}/>
			}
		</>
	)
}

TextInput.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	size: PropTypes.string,
	required: PropTypes.bool,
	helperText: PropTypes.string, 
	label: PropTypes.string,
	variant: PropTypes.string,
}

export default TextInput

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