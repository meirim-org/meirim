import FormControl from "@material-ui/core/FormControl"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import PropTypes from "prop-types"
import styled from "styled-components"
import { HelperText, Label } from "../"

const StyledTextArea = styled(TextareaAutosize)`
	border-radius: 14px;
	border: solid 1px #d1ccd5;
	background-color: #ffffff;
	resize: none;
`

const TextArea = ({ helperText, label, required }) => {

	return (
		<>
			{label && <Label text={label} required={required}/>}
			<FormControl>
				<StyledTextArea aria-label="text-area" rowsMin={4} rowsMax={4} />
				{ 
					helperText && <HelperText text={helperText}/>
				}
			</FormControl>
		</>
	)
}

TextArea.propTypes = {
	label: PropTypes.string,
	helperText:PropTypes.string,
	required: PropTypes.bool,
}

export default TextArea