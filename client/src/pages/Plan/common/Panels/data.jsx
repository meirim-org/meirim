import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'react-moment';
import { TabBox, TabPanel, Typography } from 'shared';
import LandUseVocabulary from '../../../../components/LandUseVocabulary';
import * as SC from './style';

export const DataPanel = ({
	number,
	type, 
	jurisdiction,
	depositingDate,
	stationDesc,
	lastUpdate, 
	notCredible,
	originalName,
	landUse }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	if (!number && !type && !stationDesc && !lastUpdate ) return null;

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
				<SC.Datalist>
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
					{landUse && (
						<li>
							שימוש קרקע:{" "}
							<LandUseVocabulary landUseJoined={landUse}/>
						</li>
					)}
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
				{originalName && (
					<li key="originalName">
                           שם תוכנית מקורי:{' '}
							{originalName}
						</li>
					)}
				</SC.Datalist>
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
			</TabBox>
		</TabPanel>
	);
};

DataPanel.propTypes = {
	mainDetailsFromMavat: PropTypes.string,
	number: PropTypes.string,
	type: PropTypes.string,
	jurisdiction: PropTypes.string,
	depositingDate: PropTypes.string,
	landUse: PropTypes.string,
	stationDesc: PropTypes.string,
	lastUpdate: PropTypes.string,
	originalName: PropTypes.string,
	notCredible: PropTypes.any
};

export default DataPanel;