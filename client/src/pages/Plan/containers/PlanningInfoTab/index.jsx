import React, { useEffect } from 'react';
import { PlanSelectors } from 'redux/selectors';
import { PlanDataPanel } from 'pages/Plan/common';
import { scrollToTop } from 'utils';

const PlanningInfoTab = () => {
	const { planData } = PlanSelectors();
	const { number, type, jurisdiction, depositingDate, landUse, stationDesc, lastUpdate, notCredible  } = planData;
	useEffect(() => {
		scrollToTop();
	}, []);

	return (
		<PlanDataPanel 
			number={number}
			type={type}
			jurisdiction={jurisdiction}
			depositingDate={depositingDate}
			landUse={landUse}
			stationDesc={stationDesc}
			lastUpdate={lastUpdate}
			notCredible={notCredible}
		/>
	);
};

export default PlanningInfoTab;

