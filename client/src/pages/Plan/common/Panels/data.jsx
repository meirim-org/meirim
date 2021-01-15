import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';
import t from 'locale/he_IL';
import Moment from 'react-moment';
import LandUseVocabulary from 'components/LandUseVocabulary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const PlanDataPanel = ({ 
	number,
	type, 
	jurisdiction,
	depositingDate, 
	landUse,
	stationDesc,
	lastUpdate, 
	notCredible }) => {
	const theme = useTheme();
	if (!number && !type && !jurisdiction && !depositingDate && !landUse && !stationDesc&&  !lastUpdate ) return null;

	return (
		<TabPanel>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.planData}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<ul>
					<li key="number">
                        מספר תוכנית:{' '}
						{number}
					</li>
					<li key="type">
                        סוג תוכנית:{' '}
						{type}
					</li>
					{jurisdiction && (
						<li key="jurisdiction">
                            מוסד התכנון המוסמך להפקיד את
                            התכנית: וועדה{' '}
							{jurisdiction}
						</li>
					)}
					{depositingDate && (
						<li key="depositingDate">
                            תאריך הפקדה:{' '}
							<Moment format="DD/MM/YYYY">
								{depositingDate}
							</Moment>
						</li>
					)}
					{/*<li key="landUse">*/}
                    {/*    שימוש קרקע:{' '}*/}
					{/*	<LandUseVocabulary*/}
					{/*		landUseJoined={*/}
					{/*			landUse*/}
					{/*		}*/}
					{/*	/>*/}
					{/*</li>*/}
					<li key="stationDesc">
                        סטטוס: {stationDesc}
					</li>
					<li key="lastUpdate">
                        עדכון אחרון:{' '}
						<Moment
							parse="YYYYMMDDHHmm"
							format="DD/MM/YYYY"
						>
							{lastUpdate}
						</Moment>
					</li>
				</ul>
				{!!notCredible && (
					<div className="note">
                        שימו לב! זוהי תכנית המופקדת
                        בסמכות מקומית. מכיוון שהוועדות
                        המקומיות לא מדווחות בצורה אחידה
                        אודות הסטטוס של התכניות בסמכותן
                        אנחנו ממליצים לא להסתמך על סטטוס
                        התכניות (גם לא כמו שמופיע באתר
                        "תכנון זמין"). התכנית עברה "תנאי
                        סף" וכנראה שהיא בהפקדה או תכף
                        מופקדת
					</div>
				)}
				<div className="single-line">
					<p>שתפו אותי:</p>
					<a
						className="share-link"
						target="_blank"
						rel="noopener noreferrer"
						href={
							'https://wa.me/?text=תוכנית%20שאולי%20תעניין%20אותך%3A%0A' +
                            encodeURI(
                            	window.location.toString()
                            )
						}
					>
						<FontAwesomeIcon
							icon={['fab', 'whatsapp']}
							size="lg"
							color="#25D366"
						/>
					</a>
				</div>
			</TabBox>
		</TabPanel>
	);
};

PlanDataPanel.propTypes = {
	mainDetailsFromMavat: PropTypes.string,
	number: PropTypes.string,
	type: PropTypes.string,
	jurisdiction: PropTypes.string,
	depositingDate: PropTypes.string,
	landUse: PropTypes.string,
	stationDesc: PropTypes.string,
	lastUpdate: PropTypes.string,
	notCredible: PropTypes.any
};

export default PlanDataPanel;