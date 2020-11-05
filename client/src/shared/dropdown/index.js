import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	svg: {
		left: 0,
		right: "auto"
	}
}))

export default function SimpleSelect() {
	const classes = useStyles()
	const [age, setAge] = React.useState(5)

	const handleChange = (event) => {
		setAge(event.target.value)
	}

	return (
		<>
			<InputLabel id="demo-simple-select-label">מי אני</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				variant="outlined"
				value={age}
				inputProps={{
					classes: { icon: classes.svg }
				}}
				onChange={handleChange}
			>

				<MenuItem value={5}>תושב/ת שכאפת לו/ה</MenuItem>
				<MenuItem value={10}>אחד</MenuItem>
				<MenuItem value={20}>שתים</MenuItem>
				<MenuItem value={30}>שלוש</MenuItem>
			</Select>
		</>
	)
}
