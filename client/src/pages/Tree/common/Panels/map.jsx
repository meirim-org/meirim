import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';
import Mapa from 'components/Mapa';

export const MapPanel = (props) => {
	const { geom, countyName } = props;
	const theme = useTheme();

	return (
		<TabPanel>
			<TabBox>
				<SC.TreeSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.location}
					</Typography>
				</SC.TreeSummaryTitleWrapper>
				<SC.MapWrapper>
					{geom && <Mapa
						geom={geom}
						countyName={countyName}
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