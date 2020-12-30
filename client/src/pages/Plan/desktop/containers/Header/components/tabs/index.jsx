import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs as MUITabs, Tab, Badge } from '@material-ui/core';
import t from 'locale/he_IL';
import { a11yProps } from './a11y'; 

const Tabs = ({ handleTabChange, numberOfComments, ...props }) => {
	console.log('🚀 ~ file: index.jsx ~ line 10 ~ Tabs ~props', props);

	return (
		<MUITabs onChange={handleTabChange} aria-label="טאבים של התוכנית">
			<Link to="/plan/8/summary"><Tab label={t.summary} {...a11yProps(0)} /></Link>
			<Link to="/plan/8/comments"><Tab label={<Badge badgeContent={numberOfComments}> {t.opinion} </Badge>} {...a11yProps(1)} /></Link>
			<Tab label={t.planningInformation} {...a11yProps(2)} />
		</MUITabs>
	);
};

Tabs.propTypes = {
	handleTabChange: PropTypes.func.isRequired,
	numberOfComments: PropTypes.string.isRequired,
};

export default Tabs;