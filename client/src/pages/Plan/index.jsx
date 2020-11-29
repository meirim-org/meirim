/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import t from '../../locale/he_IL';
import * as SC from './style';


function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}


const Plan = () => {
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<SC.MainWrapper>
			<SC.Content>
				<SC.Header>
					<SC.TitlesAndTabs>
						<SC.SubTitleWrapper>
							<Typography variant="subtitle1" component="span" color="primary">
                                ירושלים
							</Typography>
						</SC.SubTitleWrapper>
						<SC.TitleWrapper>
							<Typography variant="h2" component="h1">
                                איחוד וחלוקה לחלקות 18,17,16,9 ברחוב התעשייה, שכונת תלפיות, ירושלים
							</Typography>
						</SC.TitleWrapper>
						<AppBar position="static">
							<SC.CustomTabs value={value} onChange={handleChange} aria-label="simple tabs example">
								<Tab label={t.summary} {...a11yProps(0)} />
								<Tab label={t.opinion} {...a11yProps(1)} />
								<Tab label={t.planningInformation} {...a11yProps(2)} />
							</SC.CustomTabs>
						</AppBar>
					</SC.TitlesAndTabs>
					<SC.Buttons>
                        buttons
					</SC.Buttons>
				</SC.Header>
				<div>א</div>
				<div>ב</div>
			</SC.Content>
			<div>map</div>
		</SC.MainWrapper>
	);
};

export default Plan;
