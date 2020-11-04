import React from "react"
import PropTypes from "prop-types"
import MUIButton from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
	btn: {
		borderRadius: "12px",
		backgroundColor: "#652dd0",
		height:"48px",
		fontFamily: "Assistant",
		fontSize: "16px",
		fontWeight: "bold",
		fontStretch: "normal",
		fontStyle: "normal",
		lineHeight: 1.5,
		letterSpacing: "normal",
		textAlign: "center",
		color: "#ffffff",
	},
}))

const Button = ({text}) => {
	const classes = useStyles()
	return ( 
		<MUIButton size="small" variant="contained" color="primary" classes={{root: classes.btn}}>
			{text}
		</MUIButton>
	)
}

Button.propTypes = {
	text: PropTypes.string.isRequired
}

export default Button