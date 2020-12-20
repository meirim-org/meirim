import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from './slice';

const Actions = () => {
	const dispatch = useDispatch();
	const setCommentsData =  useCallback(
		({ data, responseCode }) =>  dispatch(setData({ data, responseCode })),
		[dispatch]
	);
	
	return { setCommentsData };
};

export default Actions;