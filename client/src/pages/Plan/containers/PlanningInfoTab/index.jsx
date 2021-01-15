import React, { useEffect } from 'react';
import { PlanSelectors } from 'redux/selectors';
import { GoalsPanel, DataPanel, DescriptionPanel, HousingUnitPanel, AreaUnitPanel } from 'pages/Plan/common';
import { scrollToTop } from 'utils';

const PlanningInfoTab = () => {
	const { planData, dataUnits, dataArea } = PlanSelectors();
	const { number, type, jurisdiction, depositingDate,
		landUse, stationDesc, lastUpdate, notCredible, goalsFromMavat, mainDetailsFromMavat } = planData;
	useEffect(() => {
		scrollToTop();
	}, []);

	return (
	    <>
			<DataPanel
				number={number}
				type={type}
				jurisdiction={jurisdiction}
				depositingDate={depositingDate}
				landUse={landUse}
				stationDesc={stationDesc}
				lastUpdate={lastUpdate}
				notCredible={notCredible}
			/>
			<GoalsPanel goalsFromMavat={goalsFromMavat} />
			<AreaUnitPanel dataArea={dataArea} />
			<DescriptionPanel mainDetailsFromMavat={mainDetailsFromMavat}/>
			<HousingUnitPanel dataUnits={dataUnits} />
		</>

	);
};

export default PlanningInfoTab;

