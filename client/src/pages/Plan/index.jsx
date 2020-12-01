/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { Button, Tabs, Tab, Badge } from '@material-ui/core';
import t from 'locale/he_IL';
import * as SC from './style';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { TabPanel, TabBox, Typography } from 'shared'
import { useTheme } from '@material-ui/styles';
import Wrapper from 'components/Wrapper';

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const Plan = () => {
	const theme = useTheme();
	const [value, setValue] = React.useState(0);


	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<SC.Header>
						<SC.TitlesAndTabs>
							<SC.SubTitleWrapper>
								<Typography variant="planDetailTitle" mobileVariant="smallTitle" component="span" color={theme.palette.primary.main}>
                                ירושלים
								</Typography>
							</SC.SubTitleWrapper>
							<SC.TitleWrapper>
								<Typography variant="planTitle" mobileVariant="paragraphText" component="h1" color={theme.palette.black}>
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
								<Typography variant="chipsAndIconButtons" mobileVariant="chipsAndIconButtons" component="span" color={theme.palette.gray['800']}>
									{t.sharing}
								</Typography>
							</Button>
							<Button
								variant="contained"
								color="primary"
								startIcon={<StarBorderIcon />}
							>
								<Typography variant="chipsAndIconButtons" mobileVariant="chipsAndIconButtons" component="span" color={theme.palette.gray['800']}>
									{t.saving}
								</Typography>
							</Button>
							<Button
								variant="contained"
								color="primary"
								startIcon={<ChatBubbleOutlineIcon />}
							>
								<Typography variant="chipsAndIconButtons" mobileVariant="chipsAndIconButtons" component="span" color={theme.palette.gray['800']}>
									{t.addAnOpinion}
								</Typography>
							</Button>
						</SC.Buttons>
					</SC.Header>
					<SC.Main>
						<TabPanel value={value} index={0}>
							<TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
							<TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
							<TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
						</TabPanel>
						<TabPanel value={value} index={1}>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
						</TabPanel>
						<TabPanel value={value} index={2}>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
                            <TabBox>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</TabBox>
						</TabPanel>
					</SC.Main>
				</SC.Content>
				<div>map</div>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default Plan;
