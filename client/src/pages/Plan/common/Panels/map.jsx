import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';
import Mapa from 'components/Mapa';

export const MapPanel = (props) => {
	const { tabValue, geom } = props;
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
				<SC.MapWrapper>
					{geom && <Mapa
						geom={geom}
						hideZoom={false}
						disableInteractions={true}
					/>}
				</SC.MapWrapper>
			</TabBox>
		</TabPanel>
	);
};

MapPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
	geom: PropTypes.object,
	countyName: PropTypes.string,
};

export default MapPanel;