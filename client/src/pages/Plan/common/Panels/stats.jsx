import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';
import { TabPanel, TabBox, Typography, Text } from 'shared';
import { renderMultiplier, renderPercent } from 'utils';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { series, axes } from '../../utils';
import * as SC from './style';
import { colors } from 'style';

export const StatsPanel = ({ dataArea, textArea, }) => {
	const theme = useTheme();
	if (!dataArea || !dataArea[0] || !dataArea[0].data.length) return null;

	return (
		<TabPanel>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={colors.black}
					>
						{t.areaUnitChanges}
					</Typography>
				</SC.PlanSummaryTitleWrapper>

				{textArea.exist !== 0
					?
					<>
						<Text text={`${t.thisPlanIncreases} `} color={colors.black}/>
						<Text text={`${renderMultiplier(textArea)} `} color={colors.purple[500]} weight="600"/>
						<Text text={`(${t.extension} `} color={theme.palette.gray['alt']}/>
						<Text text={`${textArea.new} ${t.meter}`} color={theme.palette.gray['alt']} weight="600"/>
						<Text text=")" color={theme.palette.gray['alt']}/>
					</>
					:
					<>
						<Text text={`${t.thisPlanAdds} ${t.buildingLand}`} color={colors.black}/>
						<Text text={`${textArea.new} ${t.meter}`} color={theme.palette.gray['alt']} weight="600"/>
					</>
				}

				<br/>

				<Text text={`${renderPercent((textArea.new + textArea.exist) / textArea.area)}% `}
					color={colors.purple[500]} weight="600"/>
				<Text text={`${t.building} `} color={colors.black}/>
				<Text text={`${t.insteadOf} `} color={theme.palette.gray['alt']}/>
				<Text text={`${renderPercent(textArea.exist / textArea.area)}%`} color={theme.palette.gray['alt']}
					weight="600"/>

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

StatsPanel.propTypes = {
	dataArea: PropTypes.array.isRequired,
	textArea: PropTypes.object.isRequired,
	url: PropTypes.string,
};

export default StatsPanel;