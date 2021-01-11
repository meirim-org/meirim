import { useEffect } from 'react';
import geojsonArea from '@mapbox/geojson-area';
import { parseNumber } from 'utils';
import { setData } from 'redux/comments/slice';
import { setPlanData } from 'redux/plan/slice';
import * as utils from './utils';
import { getPlanData, getCommentsByPlanId } from './controller';
import { useDispatch } from 'react-redux';

export const useCommentsDataHandler = (planId, refetchComments, setRefetchComments) => {
	const dispatch = useDispatch();

	useEffect (() => {
		const fetchComments = async () => {
			const response = await getCommentsByPlanId(planId);
			const comments = utils.extractComments(response.data);
			dispatch(setData({ data: comments, commentsCount: response.data.length.toString() }));
		};
		fetchComments();
		setRefetchComments(false);
	} , [planId, refetchComments, dispatch, setRefetchComments]);
};

export const useDataHandler = (planId) => {
	const dispatch = useDispatch();
	useEffect (() => {
		const fetchData = async () => {
			const response = await getPlanData(planId);
			const { 
				PLAN_COUNTY_NAME: countyName, PL_NAME: name, 
				status, goals_from_mavat: goalsFromMavat, plan_url: url, 
				areaChanges, geom } = response.data;
			const { ENTITY_SUBTYPE_DESC: type } = response.data.data;
			const newTextArea = { ...utils.initialTextArea, area: geom ? Math.round(geojsonArea.geometry(geom)) : 0 };
			const newDataArea = [{
				label: 'זכויות קיימות',
				data: []
			},
			{
				label: 'זכויות מבוקשות',
				data: []
			}];
			const newDataUnits = [{
				label: 'יחידות קיימות',
				data: []
			},
			{
				label: 'יחידות מבוקשות',
				data: []
			}];
			const changes = areaChanges ? JSON.parse(areaChanges) : null;
			if (changes) {
				changes[0].map(function(change) {
					const isRelevantChange = change[3];
					if (!isRelevantChange) return false;
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
					
					return true;
				});
				
			}
			dispatch(setPlanData({
				dataArea: newDataArea, 
				dataUnits: newDataUnits, 
				textArea: newTextArea,
				planData: { countyName, name, status, type, 
					goalsFromMavat: goalsFromMavat, url, areaChanges, geom }
			}));
		};	

		fetchData();
	} , [planId, dispatch]);
};
