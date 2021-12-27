import { useTheme } from '@material-ui/styles';
import Mapa from 'components/Mapa';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';

export const MapPanel = (props) => {
	const { geom, countyName } = props;
	const theme = useTheme();
	const { t } = useTranslation();

	if (geom) {
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
					<SC.TreeSummarySubtitleWrapper>
					<Typography variant="paragraphText" mobileVariant="paragraphText"
								component="span" color={theme.palette.gray['main']}>
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