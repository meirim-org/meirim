import React, { useEffect } from 'react';
import { PlanSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import { TextPanel, DataPanel, AreaUnitChangesPanel, SubscribePanel, MapPanel } from 'pages/Plan/common';
import { withGetScreen } from 'react-getscreen';
import { scrollToTop } from 'utils';
import t from 'locale/he_IL';

const SummaryTab = ({ subscribePanel, handleSubscribePanel, isMobile, isTablet }) => {
	const { planData, dataArea, textArea } = PlanSelectors();
	const { type, status, url, goalsFromMavat, mainDetailsFromMavat,  countyName } = planData;
	useEffect(() => {
		scrollToTop();
	}, []);

	return (
		<>
			<DataPanel type={type} status={status} url={url}/>
			<TextPanel title={t.planGoals} content={goalsFromMavat} />
			<AreaUnitChangesPanel dataArea={dataArea} textArea={textArea} />
			<TextPanel title={t.planDescription} content={mainDetailsFromMavat} />
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

