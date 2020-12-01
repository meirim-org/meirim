import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';


function TabBox(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Typography>{children}</Typography>
			)}
		</div>
	);
}

TabBox.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};


export default TabBox;
