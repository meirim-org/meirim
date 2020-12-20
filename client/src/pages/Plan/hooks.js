import { useState, useEffect } from 'react';
import geojsonArea from '@mapbox/geojson-area';
import { parseNumber } from 'utils';
import { setData } from 'redux/comments/slice';
import { setPlanData, resetPlanData } from 'redux/plan/slice';
import * as utils from './utils';
import { getPlanData, getCommentsByPlanId } from './controller';
import { useDispatch } from 'react-redux';

export const useUpdateCommentsDataHandler = (planId, refetch = false) => {
	const [ commentsData, setCommentsData ] = useState([]);

	useEffect (() => {
		const fetchComments = async () => {
			const response = await getCommentsByPlanId(planId);
			const comments = extractComments(response.data);
			setCommentsData(comments);
		};
		
		refetch && fetchComments();
	} , [planId, refetch]);

	return { commentsData }; 
};

export const useCommentsDataHandler = (planId) => {
	const dispatch = useDispatch();

	useEffect (() => {
		const fetchComments = async () => {
			const response = await getCommentsByPlanId(planId);
			const comments = extractComments(response.data);
			dispatch(setData({ data: comments }));
		};
		
		fetchComments();
	} , [planId]);

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
			let newTextArea = { ...utils.initialTextArea, area: geom ? Math.round(geojsonArea.geometry(geom)) : 0 };
			let newDataArea = [ ...utils.initialDataArea ];
	    let newDataUnits = [ ...utils.initialDataUnits ];
			const changes = areaChanges ? JSON.parse(areaChanges) : null;
			if (changes) {
				// changes[0].map(change => {
				// 	const isRelevantChange = change[3];
				// 	if (!isRelevantChange) return;
				// 	const areaChangeType = utils.getAreaChangeType(change);
				// 	const handler = utils.areaChangeHandlers[areaChangeType];
				// 	const [firstChange, secondChange] = handler(change);
				// 	if (areaChangeType) {
				// 		newDataArea[0].data.push(firstChange);
				// 		newDataArea[1].data.push(secondChange);
				// 		newTextArea.exist += parseNumber(change[5]);
				// 		newTextArea.new += parseNumber(change[6]);
				// 	} else {
				// 		newDataUnits[0].data.push(firstChange);
				// 		newDataUnits[1].data.push(secondChange);
				// 	}
				// });
			}
			dispatch(setPlanData({
				dataArea: newDataArea, 
				dataUnits: newDataUnits, 
				textArea: newTextArea,
				planData: { countyName, name, status, type, 
					goalsFromMavat: goalsFromMavat, url, areaChanges, geom }
			}));
			
			return () => dispatch(resetPlanData({}));
				
		};	

		
		fetchData();
	} , [planId]);
};

export const extractComments = (comments) => {
	let forDeletion = [];
	comments.map((comment) => {
		let parentId = comment.parent_id;

		if (parentId !== null ) {
			let parent = comments.find(comment => comment.id === parentId);
			if (parent && parent.subComments === undefined) {
				parent.subComments = [];
			} 
			parent.subComments.push(comment);
			forDeletion.push(comment.id);
		}
	});
	comments = comments.filter(item => !forDeletion.includes(item.id));

	return comments;
};
