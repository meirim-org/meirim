import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';

export const MapPanel = ({ tabValue }) => {
	const theme = useTheme();

	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.location}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<SC.EntryContent>
                    map
				</SC.EntryContent>
			</TabBox>
		</TabPanel>
	);
};

MapPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
};

export default MapPanel;