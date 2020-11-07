import React from "react"
import FormHelperText from "@material-ui/core/FormHelperText"
import { makeStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"

const useStyles = makeStyles(() => ({
	helperText: {
		textAlign:"right",
		fontFamily: "Assistant",
		fontSize: "12px",
		fontWeight: "normal",
		fontStretch: "normal",
		fontStyle: "normal",
		lineHeight: 1.5,
		letterSpacing: "normal",
		color: "#8f5de2",
	},
}))

const HelperText = ({ text }) => {
	const classes = useStyles()

	return (
		<>
			<FormHelperText className={classes.helperText}>{text}</FormHelperText>
		</>
	)
}

HelperText.propTypes = {
	text: PropTypes.string.isRequired
}

export default HelperText
