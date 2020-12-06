import React from 'react';
import { notAuthenticated } from 'redux/user/slice';
import { logout } from 'services/user';
import { Hidden } from '@material-ui/core';
import { UserSelectors } from 'redux/selectors';
import MobileNavBar from './mobile';
import DesktopNavBar from './desktop';
import { useDispatch } from 'react-redux';

const Navigation = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, user } = UserSelectors();

	const logoutHandler = async () => {
		const response = await logout();
		if (response.status === 'OK') dispatch(notAuthenticated());
	};
	
	return (
		<React.Fragment>
			<Hidden mdUp> <MobileNavBar logoutHandler={logoutHandler} user={user} isAuthenticated={isAuthenticated}/></Hidden>
			<Hidden mdDown> <DesktopNavBar logoutHandler={logoutHandler} user={user} isAuthenticated={isAuthenticated}/></Hidden>
		</React.Fragment>
	);
};

export default Navigation;
