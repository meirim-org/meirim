import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';
import { TabPanel, TabBox } from 'shared';
import { renderMultiplier, renderPercent } from 'utils';
import { series, axes } from '../utils';

export const GoalsPanel = ({ goalsFromMavat, tabValue }) => 
	<TabPanel value={tabValue} index={0}>
		<TabBox>{goalsFromMavat}</TabBox>
	</TabPanel>;

GoalsPanel.propTypes = {
	goalsFromMavat: PropTypes.string.isRequired,
	tabValue: PropTypes.string.isRequired,
};

/*mynameisuh*/
export const StatusTypeUrlPanel = ({ status, tabValue, type, url }) => 
	<TabPanel value={tabValue} index={0}>
		<TabBox>{`סטטוס: ${status}  סוג תוכנית: ${type}  מסמכי התוכנית באתר הממשלה: ${url}`}</TabBox>
	</TabPanel>;

StatusTypeUrlPanel.propTypes = {
	type: PropTypes.string.isRequired,
	status: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	tabValue: PropTypes.string.isRequired,
};

export const StatsPanel = ({ tabValue, dataArea, textArea, }) => {
	const meter = 'מ"ר';
	
	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				{!!dataArea && !!dataArea[0].data.length && (
					<div className="rectangle">
						<h4>שינוי שטח</h4>
						{textArea.exist !== 0 &&
														<p>
																תוכנית זו מגדילה את השטח הבנוי
																פי {renderMultiplier(textArea)}{' '}
																(תוספת {textArea.new} {meter})
														</p>
						}
						{textArea.exist === 0 &&
														<p>
																תוכנית זו מוסיפה
															{textArea.new} {meter} 
																שטח בנוי
														</p>
						}
						<p>
							{renderPercent(
								(textArea.new +
																		textArea.exist) /
																		textArea.area
							)}
														% בניה (במקום{' '}
							{renderPercent(
								textArea.exist /
																		textArea.area
							)}
														% )
						</p>
						<div style={{ height: 200 }}>
							<Chart
								series={series}
								data={dataArea}
								axes={axes}
								tooltip={true}
							/>
						</div>
					</div>
				)}
			</TabBox>
		</TabPanel>
	);
};

StatsPanel.propTypes = {
	dataArea: PropTypes.array.isRequired,
	textArea: PropTypes.object.isRequired,
	url: PropTypes.string.isRequired,
	tabValue: PropTypes.string.isRequired,
};