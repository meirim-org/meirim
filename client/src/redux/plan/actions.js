import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from './slice';

const Actions = () => {
	const dispatch = useDispatch();
	const setPlanData =  useCallback(
		({ data, responseCode }) =>  dispatch(setData({ data, responseCode })),
		[dispatch]
	);
	
	return { setPlanData };
};

export default Actions;