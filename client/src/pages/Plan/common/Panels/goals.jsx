import { useTheme } from '@material-ui/styles';
import UnsafeRender from 'components/UnsafeRender';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';

export const GoalsPanel = ({ goalsFromMavat, goalsFromMavatArabic }) => {
	const theme = useTheme();
	const { t, selectedLanguage } = useTranslation();
	if (!goalsFromMavat) return null;

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
						{t.planGoals}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<SC.EntryContent>
					<UnsafeRender
						html={
							selectedLanguage === 'AR'
								? goalsFromMavatArabic || goalsFromMavat
								: goalsFromMavat
						}
					/>
				</SC.EntryContent>
			</TabBox>
		</TabPanel>
	);
};

GoalsPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
	goalsFromMavatArabic: PropTypes.string,
};

export default GoalsPanel;
