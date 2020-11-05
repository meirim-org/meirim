import React from "react"
import FormControl from "@material-ui/core/FormControl"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import FormHelperText from "@material-ui/core/FormHelperText"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
	helperText: {
		textAlign:"right"
	},
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
			<TextareaAutosize aria-label="text-area" rowsMin={4} rowsMax={4}  className={classes.textArea}/>
			<FormHelperText >Some important helper text</FormHelperText>
		</FormControl>
	)
}

export default TextArea