import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { authenticated, notAuthenticated } from './slice';

const Actions = () => {
	const dispatch = useDispatch();
	const markAsAuthenticated = useCallback(((user) =>  dispatch(authenticated({ user })),[dispatch]));
	const markAsNotAuthenticated = useCallback(() =>  dispatch(notAuthenticated()), [dispatch]);
	
	return { markAsAuthenticated, markAsNotAuthenticated };
};

export default Actions;