import React from 'react';
import PropTypes from 'prop-types';
import { GoalsPanel, PlanDetailsPanel, StatsPanel, SubscribePanel, MapPanel } from 'pages/Plan/common';

const SummaryTab = ({ 
	tabValue, planData, dataArea, textArea,
	subscribePanel, handleSubscribePanel, 
	  }) => {
	const { type, status, url, goalsFromMavat, geom } = planData;
	//Temporary
	const planTerms = ['פינוי בינוי', 'חלוקת מגרשים', 'שיקום עירוני'];

	return (
		<>
			<PlanDetailsPanel tabValue={tabValue} type={type} status={status} url={url} terms={planTerms} />
			<SubscribePanel
				tabValue={tabValue}
						 	subscribePanel={subscribePanel}
				handleSubscribePanel={handleSubscribePanel}/>

			<MapPanel tabValue={tabValue} geom={geom}   />
			<GoalsPanel goalsFromMavat={goalsFromMavat} tabValue={tabValue} />
			<StatsPanel tabValue={tabValue} dataArea={dataArea} textArea={textArea} />
		</>
	);
};

SummaryTab.propTypes = {
	planData: PropTypes.object.isRequired,
	tabValue: PropTypes.any.isRequired,
	dataArea: PropTypes.array.isRequired,
	textArea: PropTypes.object.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
};

export default SummaryTab;