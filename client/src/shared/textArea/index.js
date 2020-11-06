import React from "react"
import FormControl from "@material-ui/core/FormControl"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import { makeStyles } from "@material-ui/core/styles"
import { HelperText, Label } from "../../style/components"
import PropTypes from "prop-types"

const useStyles = makeStyles(() => ({
	textArea :{
		borderRadius: "14px",
		border: "solid 1px #d1ccd5",
		backgroundColor: "#ffffff",
		resize:"none"
	}
}))

const TextArea = ({ label, required }) => {
	const classes = useStyles()

	return (
		<>
			{label && <Label text={label} required={required}/>}
			<FormControl>
				<TextareaAutosize aria-label="text-area" rowsMin={4} rowsMax={4} className={classes.textArea} />
				<HelperText text="תרשום משהו כדי שאנשים ידעו מי אתה"/>
			</FormControl>
		</>
	)
}

TextArea.propTypes = {
	label: PropTypes.string,
	required: PropTypes.bool,
}
export default TextArea