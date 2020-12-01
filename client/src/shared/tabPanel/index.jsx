import React from 'react';
import PropTypes from 'prop-types';

const TabPanel = ({
	children, value, index, ...other
}) => (
	<div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	>
		{value === index && (
			children
		)}
	</div>
);

TabPanel.propTypes = {
	children: PropTypes.any,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

export default TabPanel;
