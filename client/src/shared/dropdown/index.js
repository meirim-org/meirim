import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import PropTypes from "prop-types"
import { Label } from "../../style/components"

const useStyles = makeStyles(() => ({
	root :{
		backgroundColor: "white",
		borderRadius: "12px"
	},
	svg: {
		left: 10,
		right: "auto"
	}
}))

const Dropdown = ({ options, label, required }) => {

	const classes = useStyles()
	const [value, setValue] = React.useState(options[0].value)

	const handleChange = (event) => {
		setValue(event.target.value)
	}

	return (
		<>
			{label &&	<Label required={required} text={label} />}
			<Select
				required={required}
				variant="outlined"
				value={value}
				className={classes.root}
				inputProps={{
					classes: { root: classes.root, icon: classes.svg }
				}}
				onChange={handleChange}
			>
				{options.map(( optn, index ) => <MenuItem key={index} value={optn.value}>{optn.text}</MenuItem>)}
			</Select>
		</>
	)
}

Dropdown.propTypes = {
	label: PropTypes.string,
	required: PropTypes.bool,
	options: PropTypes.object.isRequired
}

export default Dropdown
