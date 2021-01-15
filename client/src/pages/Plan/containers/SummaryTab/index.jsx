import React, { useEffect } from 'react';
import { PlanSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import { GoalsPanel, DetailsPanel, StatsPanel, SubscribePanel, MapPanel } from 'pages/Plan/common';
import { withGetScreen } from 'react-getscreen';
import { scrollToTop } from 'utils';

const SummaryTab = ({ subscribePanel, handleSubscribePanel, isMobile, isTablet }) => {
	const { planData, dataArea, textArea } = PlanSelectors();
	const { type, status, url, goalsFromMavat, countyName } = planData;
	useEffect(() => {
		scrollToTop();
	}, []);

	return (
		<>
			<DetailsPanel type={type} status={status} url={url}/>
			<GoalsPanel goalsFromMavat={goalsFromMavat} />
			<StatsPanel dataArea={dataArea} textArea={textArea} />
			{isMobile() || isTablet()
				?
				<MapPanel geom={planData.geom} countyName={countyName}/>
				:
				null
			}
			<SubscribePanel
				subscribePanel={subscribePanel}
				handleSubscribePanel={handleSubscribePanel}/>
		</>
	);
};

SummaryTab.propTypes = {
	isMobile:PropTypes.func.isRequired,
	isTablet:PropTypes.func.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
};

export default withGetScreen(SummaryTab, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });

