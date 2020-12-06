import React from 'react';
import { useTheme } from '@material-ui/styles';
import { Chart } from 'react-charts';
import { Button, Tabs, Tab, Badge } from '@material-ui/core';
import t from 'locale/he_IL';
import geojsonArea from '@mapbox/geojson-area';
import * as SC from './style';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { TabPanel, TabBox, Typography } from 'shared'
import Wrapper from 'components/Wrapper';
import { a11yProps } from './a11y'
import Opinions from './Opinions'
import { getPlanData } from './controller'
import {openModal} from "../../redux/modal/slice";

const axes = [
	{ primary: true, type: 'ordinal', position: 'bottom' },
	{ position: 'left', type: 'linear', stacked: true }
];

const renderMultiplier = areaObj =>
	Math.round(((areaObj.new + areaObj.exist) / areaObj.exist) * 100) / 100;
const renderPercent = number => Math.round(number * 100);
const parseNumber = string => {
	string = string.replace(',', '');
	if (parseInt(string)) {
		return parseInt(string.replace(',', ''));
	}
	if (string.charAt(0) === '-') {
		return -parseInt(string.slice(1));
	}
	
	return 0;
};

const Plan = () => {
	const theme = useTheme();
	const [planData, setPlanData] = React.useState({
		countyName: '',
	 	planName: '', 
	 	status: '', 
	 	type:'', 
		goalsFromMavat: '',
		planUrl: '',
		areaChanges: ''
	})
	const [textArea, setTextArea] = React.useState({
		exist: 0,
		new: 0,
		area:0
	})

	const [ dataArea, setDataArea ] = React.useState([
		{
			label: 'זכויות קיימות',
			data: []
		},
		{
			label: 'זכויות מבוקשות',
			data: []
		}	
	]) 
	const [ dataUnits, setDataUnits ] = React.useState([
		{
			label: 'יחידות קיימות',
			data: []
		},
		{
			label: 'יחידות מבוקשות',
			data: []
		}

	])
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// React.useEffect (() => {
	// 	async function fetchData() {
	// 		const response = await getPlanData(2)
	// 		const { PLAN_COUNTY_NAME, PL_NAME, status, goals_from_mavat, plan_url, areaChanges, geom } = response.data
	// 		const { ENTITY_SUBTYPE_DESC: type } = response.data.data
    //
	// 		console.log('🚀 ~ file: index.jsx ~ line 138 ~ fetchData ~ geom', geom)
	// 		const newTextArea = {
	// 			...textArea,
	// 			area: geom ? Math.round(geojsonArea.geometry(geom)) : 0
	// 		}
	// 		const newDataArea = [
	// 			...dataArea
	// 		]
	//      const newDataUnits = [
	// 			 ...dataUnits
	// 		];
	// 		const changes = areaChanges ? JSON.parse(areaChanges) : null
	// 		changes && changes[0].forEach(change => {
    //         	if (!change[3]) return;
    //         	if (change[3].includes('מ"ר')) {
    //         		newDataArea[0].data.push({
    //         			x: change[3],
    //         			y: parseNumber(change[5])
    //         		});
    //         		newDataArea[1].data.push({
    //         			x: change[3],
    //         			y: parseNumber(change[6])
    //         		});
    //
    //         		newTextArea.exist += parseNumber(change[5]);
    //         		newTextArea.new += parseNumber(change[6]);
    //         	} else {
    //         		newDataUnits[0].data.push({
    //         			x: change[3],
    //         			y: parseNumber(change[5])
    //         		});
    //         		newDataUnits[1].data.push({
    //         			x: change[3],
    //         			y: parseNumber(change[6])
    //         		});
    //         	}
	// 		});
	// 		setDataArea(newDataArea)
	// 		setTextArea(newTextArea)
	// 		setDataUnits(newDataUnits)
    //
	// 		setPlanData(pv => ({ ...pv,
	// 			countyName: PLAN_COUNTY_NAME,
	// 			planName: PL_NAME,
	// 			status, type, goalsFromMavat: goals_from_mavat,
	// 			planUrl: plan_url,
	// 			areaChanges,
	// 			geom,
	// 		 }))
	// 	}
	// 	fetchData()
    //
	// } , [])

	const series = { type: 'bar' };

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
							<TabBox>{`סטטוס: ${planData.status}  סוג תוכנית: ${planData.type} מסמכי התוכנית באתר הממשלה: ${planData.planUrl}`}</TabBox>
							<TabBox>{planData.goalsFromMavat}</TabBox>
                            <TabBox>
                                {!!dataArea && !!dataArea[0].data.length && (
                                    <div className="rectangle">
                                        <h4>שינוי שטח</h4>
                                        {textArea.exist !== 0 &&
                                        <p>
                                            תוכנית זו מגדילה את השטח הבנוי
                                            פי {renderMultiplier(textArea)}{' '}
                                            (תוספת {textArea.new} מ"ר)
                                        </p>
                                        }
                                        {textArea.exist === 0 &&
                                        <p>
                                            תוכנית זו מוסיפה
                                            {' '}
                                            {textArea.new} מ"ר
                                            שטח בנוי
                                        </p>
                                        }
                                        <p>
                                            {renderPercent(
                                                (textArea.new +
                                                    textArea.exist) /
                                                textArea.area
                                            )}
                                            % בניה (במקום{' '}
                                            {renderPercent(
                                                textArea.exist /
                                                textArea.area
                                            )}
                                            % )
                                        </p>
                                        <div style={{ height: 200 }}>
                                            <Chart
                                                series={series}
                                                data={dataArea}
                                                axes={axes}
                                                tooltip={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabBox>
                        </TabPanel>
						<TabPanel value={value} index={1}>
                            <Opinions />
						</TabPanel>
						<TabPanel value={value} index={2}>
						</TabPanel>
					</SC.Main>
				</SC.Content>
				<div>map</div>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default Plan;
