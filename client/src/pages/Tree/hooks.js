import { useEffect } from 'react';
import { setTreeData } from 'redux/tree/slice';
import { getTreeData } from './controller';
import { useDispatch } from 'react-redux';

export const useDataHandler = (treeId) => {
	const dispatch = useDispatch();
	useEffect (() => {
		window.scrollTo(0, 0);
		const fetchData = async () => {
			const response = await getTreeData(treeId);
			const { 
				place, street , street_number, action, trees_per_permit, permit_number,
				start_date, end_date, total_trees, url , reason_short, reason_detailed, 
				 geom } = response.data;
			
			dispatch(setTreeData({
				treeData: { 
					place, street , street_number, action, trees_per_permit, permit_number,
					start_date, end_date, total_trees, url , reason_short, reason_detailed, 
					 geom }
			}));
		};	

		fetchData();
	} , [treeId, dispatch]);
};
