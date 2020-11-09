import PropTypes from "prop-types"
import MUIButton from "@material-ui/core/Button"
import styled from "styled-components"

const StyledButton = styled(MUIButton)`
	border-radius: 12px;
	height: 2.75em;
	font-family: Assistant;
	font-size: 16px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.5;
	letter-spacing: normal;
	text-align: center;
	color: #ffffff;
	background-color: #652dd0 !important;
`
const Button = ({text}) => {
	return ( 
		<StyledButton size="small" variant="contained" color="primary">
			{text}
		</StyledButton>
	)
}

Button.propTypes = {
	text: PropTypes.string.isRequired
}

export default Button