import { useState } from "react"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Label } from "../"

const StyledSelect = styled(Select)`
	background-color: white;
	border-radius: 12px !important;
	& > svg {
		left: 0.2em;
		right: auto;
	}
`

const Dropdown = ({ options, label, required }) => {
	const [value, setValue] = useState(options[0].value)

	const handleChange = (event) => {
		setValue(event.target.value)
	}

	return (
		<>
			{label &&	<Label required={required} text={label} />}
			<StyledSelect
				required={required}
				variant="outlined"
				value={value}
				onChange={handleChange}
			>
				{options.map(( optn, index ) => <MenuItem key={index} value={optn.value}>{optn.text}</MenuItem>)}
			</StyledSelect>
		</>
	)
}

Dropdown.propTypes = {
	label: PropTypes.string,
	required: PropTypes.bool,
	options: PropTypes.array.isRequired
}

export default Dropdown
