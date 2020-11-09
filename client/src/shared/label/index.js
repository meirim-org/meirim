import styled from "styled-components"
import PropTypes from "prop-types"
import InputLabel from "@material-ui/core/InputLabel"

export const Required = styled.span`
  color:red;
`

const Label = ({required = false, text}) => {
	if(!text) return 
	return ( 
		<InputLabel> {text} {required && <Required>*</Required>} </InputLabel>
	)
}

Label.propTypes = {
	required: PropTypes.bool,
	text: PropTypes.string.isRequired
}

export default Label