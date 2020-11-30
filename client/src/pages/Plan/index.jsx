/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';
import { Button, Tabs, Tab, Typography, Badge } from '@material-ui/core';
import t from '../../locale/he_IL';
import * as SC from './style';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { TabPanel } from '../../shared'

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
						<SC.AppBar position="static">
							<Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
								<Tab label={t.summary} {...a11yProps(0)} />
								<Tab label={
								    <Badge
										badgeContent={'12'}
									>
										{t.opinion}
									</Badge>
								} {...a11yProps(1)} />
								<Tab label={t.planningInformation} {...a11yProps(2)} />
							</Tabs>
						</SC.AppBar>
					</SC.TitlesAndTabs>
					<SC.Buttons>
						<Button
							variant="contained"
							color="primary"
							startIcon={<ShareIcon />}
						>
							<span>{t.sharing}</span>
						</Button>
						<Button
							variant="contained"
							color="primary"
							startIcon={<StarBorderIcon />}
						>
							<span>{t.saving}</span>
						</Button>
						<Button
							variant="contained"
							color="primary"
							startIcon={<ChatBubbleOutlineIcon />}
						>
							<span>{t.addAnOpinion}</span>
						</Button>
					</SC.Buttons>
				</SC.Header>
				<SC.Main>
					<TabPanel value={value} index={0}>
                        Item One
					</TabPanel>
					<TabPanel value={value} index={1}>
                        Item Two
					</TabPanel>
					<TabPanel value={value} index={2}>
                        Item Three
					</TabPanel>
				</SC.Main>
			</SC.Content>
			<div>map</div>
		</SC.MainWrapper>
	);
};

export default Plan;
