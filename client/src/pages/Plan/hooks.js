import { useState, useEffect } from 'react';
import geojsonArea from '@mapbox/geojson-area';
import { parseNumber } from 'utils';
import * as utils from './utils';
import { getPlanData, getCommentsByPlanId } from './controller';

export const useDataHandler = (planId) => {
	const [ planData, setPlanData ] = useState(utils.initialPlanData);
	const [ commentsData, setCommentsData ] = useState([]);
	const [ textArea, setTextArea ] = useState(utils.initialTextArea);
	const [ dataArea, setDataArea ] = useState(utils.initialDataArea); 
	const [ dataUnits, setDataUnits ] = useState([utils.initialDataUnits]);

	useEffect (() => {
		const fetchData = async () => {
			const response = await getPlanData(planId);
			
			const { 
				PLAN_COUNTY_NAME: countyName, PL_NAME: name, 
				status, goals_from_mavat: goalsFromMavat, plan_url: url, 
				areaChanges, geom } = response.data;
			const { ENTITY_SUBTYPE_DESC: type } = response.data.data;
			const newTextArea = { ...textArea, area: geom ? Math.round(geojsonArea.geometry(geom)) : 0 };
			const newDataArea = [ ...dataArea ];
	    const newDataUnits = [ ...dataUnits ];
			const changes = areaChanges ? JSON.parse(areaChanges) : null;
			if (changes) {
				changes[0].forEach(change => {
					const isRelevantChange = change[3];
					if (!isRelevantChange) return;
					const areaChangeType = utils.getAreaChangeType(change);
					const handler = utils.areaChangeHandlers[areaChangeType];
					const [firstChange, secondChange] = handler(change);
					if (areaChangeType) {
						newDataArea[0].data.push(firstChange);
						newDataArea[1].data.push(secondChange);
						newTextArea.exist += parseNumber(change[5]);
						newTextArea.new += parseNumber(change[6]);
					} else {
						newDataUnits[0].data.push(firstChange);
						newDataUnits[1].data.push(secondChange);
					}
				});
			}
			setDataArea(newDataArea);
			setTextArea(newTextArea);
			setDataUnits(newDataUnits);
			setPlanData(pv => ({ ...pv, countyName, name, status, type, 
				goalsFromMavat: goalsFromMavat, url, areaChanges, geom }));
		};	

		const fetchComments = async () => {
			const response = await getCommentsByPlanId(planId);
			const comments = response.data;
			setCommentsData(comments);
		};
		
		fetchData();
		fetchComments();
	} , []);

	return { textArea, dataArea, planData, dataUnits, commentsData }; 
};