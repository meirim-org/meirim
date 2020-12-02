import React from 'react';
import { useTheme } from '@material-ui/styles';
import { Button, Tabs, Tab, Badge } from '@material-ui/core';
import t from 'locale/he_IL';
import * as SC from './style';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { TabPanel, TabBox, Typography } from 'shared'
import Wrapper from 'components/Wrapper';
import { a11yProps } from './a11y' 
import { getPlanData } from './controller'

const Plan = () => {
	const theme = useTheme();
	const [planData, setPlanData] = React.useState({ countyName: '', planName: '', status: '' })
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	React.useEffect (() => {
		async function fetchData() {
			const response = await getPlanData(2)
			const { PLAN_COUNTY_NAME, PL_NAME, status } = response.data
			console.log('🚀 ~ file: index.jsx ~ line 32 ~ fetchData ~ PL_COUNTY_NAME', PLAN_COUNTY_NAME)
			console.log('🚀 ~ file: index.jsx ~ line 33 ~ fetchData ~  response.data',  response.data)
			setPlanData(pv => ({ ...pv, countyName: PLAN_COUNTY_NAME, planName: PL_NAME, status }))
		}
		fetchData()

	} , [])

	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<SC.Header>
						<SC.TitlesAndTabs>
							<SC.SubTitleWrapper>
								<Typography variant="planDetailTitle" mobileVariant="smallTitle" component="span" color={theme.palette.primary.main}>
									{planData.countyName}
								</Typography>
							</SC.SubTitleWrapper>
							<SC.TitleWrapper>
								<Typography variant="planTitle" mobileVariant="paragraphText" component="h1" color={theme.palette.black}>
									{planData.planName}
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
							<TabBox>{`סטטוס: ${planData.status}`}</TabBox>
						</TabPanel>
					</SC.Main>
				</SC.Content>
				<div>map</div>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default Plan;
