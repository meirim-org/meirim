import React from 'react';
import { PlanSelectors } from 'redux/selectors';
import { GoalsPanel, DataPanel, DescriptionPanel, HousingUnitPanel, AreaUnitPanel } from 'pages/Plan/common';
import { useScrollToTop } from '../../hooks';

const PlanningInfoTab = () => {
	const { planData, dataUnits, dataArea } = PlanSelectors();
	const { number, type, jurisdiction, depositingDate,
		stationDesc, lastUpdate, notCredible, goalsFromMavat, mainDetailsFromMavat } = planData;
	useScrollToTop();
    
	return (
	    <>
			<DataPanel
				number={number}
				type={type}
				jurisdiction={jurisdiction}
				depositingDate={depositingDate}
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

