import { useTheme } from '@material-ui/styles';
import Mapa from 'components/Mapa';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';

export const MapPanel = (props) => {
	const { geom } = props;
	const theme = useTheme();
	const { t } = useTranslation();

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
						{t.location}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<SC.MapWrapper>
					{geom && <Mapa
						geom={geom}
						hideZoom={false}
						disableInteractions={false}
					/>}
				</SC.MapWrapper>
			</TabBox>
		</TabPanel>
	);
};

MapPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
	geom: PropTypes.object,
	countyName: PropTypes.string,
};

export default MapPanel;