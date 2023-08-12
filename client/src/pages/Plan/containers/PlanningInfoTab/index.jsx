import React from 'react';
import { PlanSelectors } from 'redux/selectors';
import {
	GoalsPanel,
	DataPanel,
	DescriptionPanel,
	HousingUnitPanel,
	AreaUnitPanel,
} from 'pages/Plan/common';
import { useScrollToTop } from '../../hooks';

const PlanningInfoTab = () => {
	const { planData, dataUnits, dataArea } = PlanSelectors();
	const {
		number,
		type,
		jurisdiction,
		depositingDate,
		stationDesc,
		lastUpdate,
		notCredible,
		landUse,
		goalsFromMavat,
		mainDetailsFromMavat,
		mainDetailsFromMavatArabic,
		originalName,
		goalsFromMavatArabic,
	} = planData;
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
				landUse={landUse}
				originalName={originalName}
			/>
			<DescriptionPanel
				mainDetailsFromMavat={mainDetailsFromMavat}
				mainDetailsFromMavatArabic={mainDetailsFromMavatArabic}
			/>
			<GoalsPanel
				goalsFromMavat={goalsFromMavat}
				goalsFromMavatArabic={goalsFromMavatArabic}
			/>
			<AreaUnitPanel dataArea={dataArea} />
			<HousingUnitPanel dataUnits={dataUnits} />
		</>
	);
};

export default PlanningInfoTab;
