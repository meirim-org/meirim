import React from 'react';
import { PlanSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import { GoalsPanel, PlanDetailsPanel, StatsPanel, SubscribePanel } from 'pages/Plan/common';

const SummaryTab = ({ subscribePanel, handleSubscribePanel }) => {
	const { planData, dataArea, textArea } = PlanSelectors();
	const { type, status, url, goalsFromMavat } = planData;

	return (
		<>
			<PlanDetailsPanel type={type} status={status} url={url}/>
			<GoalsPanel goalsFromMavat={goalsFromMavat} />
			<SubscribePanel 
				subscribePanel={subscribePanel}
				handleSubscribePanel={handleSubscribePanel}/>
			<StatsPanel dataArea={dataArea} textArea={textArea} />
		</>
	);
};

SummaryTab.propTypes = {
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
};

export default SummaryTab;