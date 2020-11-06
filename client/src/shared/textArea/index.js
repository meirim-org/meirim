import React from "react"
import FormControl from "@material-ui/core/FormControl"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import { makeStyles } from "@material-ui/core/styles"
import { HelperText } from "../../style/components"

const useStyles = makeStyles(() => ({
	textArea :{
		borderRadius: "14px",
		border: "solid 1px #d1ccd5",
		backgroundColor: "#ffffff",
		resize:"none"
	}
}))

const TextArea = () => {
	const classes = useStyles()

	return (
		<FormControl>
			<TextareaAutosize aria-label="text-area" rowsMin={4} rowsMax={4} className={classes.textArea} />
			<HelperText text="תרשום משהו כדי שאנשים ידעו מי אתה"/>
		</FormControl>
	)
}

export default TextArea