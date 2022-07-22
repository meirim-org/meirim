import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { Chart } from 'react-charts';
import { TabBox, TabPanel, Typography } from 'shared';
import { axes, series } from '../../utils';
import * as SC from './style';

export const AreaUnitPanel = ({ dataArea }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	if (!dataArea || !dataArea[0] || !dataArea[0].data.length || (dataArea[0].data[0].y === 0 && dataArea[1].data[0].y === 0 )) return null;

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
						{t.areaUnitChanges}
					</Typography>
				</SC.PlanSummaryTitleWrapper>

				<SC.ChartWrapper>
					<Chart
						series={series}
						data={dataArea}
						axes={axes}
						tooltip={true}
					/>
				</SC.ChartWrapper>

			</TabBox>
		</TabPanel>
	);
};

AreaUnitPanel.propTypes = {
	dataArea: PropTypes.array.isRequired,
	url: PropTypes.string,
};

export default AreaUnitPanel;