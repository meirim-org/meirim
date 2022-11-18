import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { Chart } from 'react-charts';
import { TabBox, TabPanel, Typography } from 'shared';
import { axes, series } from '../../utils';
import * as SC from './style';

export const HousingUnitPanel = ({ dataUnits }) => {
	const theme = useTheme();
	const { t } = useTranslation()
	if (!dataUnits || !dataUnits[0] || !dataUnits[0].data.length || (dataUnits[0].data[0].y ===0 && dataUnits[1].data[0].y ===0 )) return null;
	
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
						{t.housingUnitChanges}
					</Typography>
				</SC.PlanSummaryTitleWrapper>

				<SC.ChartWrapper>
					<Chart
						series={series}
						data={dataUnits}
						axes={axes}
						tooltip={true}
					/>
				</SC.ChartWrapper>

			</TabBox>
		</TabPanel>
	);
};

HousingUnitPanel.propTypes = {
	dataUnits: PropTypes.array.isRequired,
};

export default HousingUnitPanel;