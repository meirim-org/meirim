import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import * as SC from './style';
import Mapa from 'components/Mapa';
import { colors } from 'style';

export const MapPanel = (props) => {
	const { geom, countyName } = props;

	if (geom) {
		return (
			<TabPanel>
				<TabBox>
					<SC.TreeSummaryTitleWrapper>
						<Typography
							variant="planDetailTitle"
							mobileVariant="planDetailTitle"
							component="h2"
							color={colors.black}
						>
							{t.location}
						</Typography>
					</SC.TreeSummaryTitleWrapper>
					<SC.TreeSummarySubtitleWrapper>
					<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={colors.grey[500]}>
							{t.estimatedLocation}
						</Typography>
					</SC.TreeSummarySubtitleWrapper>
					<SC.MapWrapper>
						<Mapa
							geom={geom}
							countyName={countyName}
							hideZoom={false}
							disableInteractions={false}
							showPlaceholder={true}
						/>
					</SC.MapWrapper>
				</TabBox>
			</TabPanel>
		);
	} else {
		return null;
	}
};

MapPanel.propTypes = {
	goalsFromMavat: PropTypes.string,
	geom: PropTypes.object,
	countyName: PropTypes.string,
};

export default MapPanel;