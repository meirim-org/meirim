import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as MUITabs, Tab, Badge } from '@material-ui/core';
import t from 'locale/he_IL';
import { a11yProps } from './a11y'; 

const Tabs = ({ tabValue, handleTabChange, numberOfComments }) => {

	return (
		<MUITabs value={tabValue} onChange={handleTabChange} aria-label="טאבים של התוכנית">
			<Tab label={t.summary} {...a11yProps(0)} />
			<Tab label={<Badge badgeContent={numberOfComments}> {t.opinion} </Badge>} {...a11yProps(1)} />
			<Tab label={t.planningInformation} {...a11yProps(2)} />
		</MUITabs>
	);
};

Tabs.propTypes = {
	tabValue: PropTypes.any.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	numberOfComments: PropTypes.string.isRequired,
};

export default Tabs;