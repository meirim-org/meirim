import React from 'react';
import { PlanSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import { GoalsPanel, PlanDetailsPanel, StatsPanel, SubscribePanel, MapPanel } from 'pages/Plan/common';

const SummaryTab = ({ subscribePanel, handleSubscribePanel }) => {
	const { planData, dataArea, textArea } = PlanSelectors();
	const { type, status, url, goalsFromMavat, geom } = planData;
	const planTerms = ['פינוי בינוי', 'חלוקת מגרשים', 'שיקום עירוני']; // temp

	return (
		<>
			<PlanDetailsPanel type={type} status={status} url={url} terms={planTerms} />
			<SubscribePanel
			 	subscribePanel={subscribePanel}
				handleSubscribePanel={handleSubscribePanel}/>

			<MapPanel geom={geom} />
			<GoalsPanel goalsFromMavat={goalsFromMavat} />
			<StatsPanel dataArea={dataArea} textArea={textArea} />
		</>
	);
};

SummaryTab.propTypes = {
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
};

export default SummaryTab;