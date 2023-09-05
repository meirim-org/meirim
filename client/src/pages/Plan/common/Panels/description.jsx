import { useTheme } from '@material-ui/styles';
import UnsafeRender from 'components/UnsafeRender';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';

export const DescriptionPanel = ({
	mainDetailsFromMavat,
	mainDetailsFromMavatArabic,
}) => {
	const theme = useTheme();
	const { selectedLanguage, t } = useTranslation();
	if (!mainDetailsFromMavat) return null;

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
						{t.planDescription}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<SC.EntryContent>
					<UnsafeRender
						html={
							selectedLanguage === 'AR'
								? mainDetailsFromMavatArabic ||
                                  mainDetailsFromMavat
								: mainDetailsFromMavat
						}
					/>
				</SC.EntryContent>
			</TabBox>
		</TabPanel>
	);
};

DescriptionPanel.propTypes = {
	mainDetailsFromMavat: PropTypes.string,
};

export default DescriptionPanel;
