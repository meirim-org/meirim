import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { notAuthenticated } from 'redux/user/slice';
import { logout } from 'services/user';
import { UserSelectors } from 'redux/selectors';
import MobileNavBar from './mobile';
import DesktopNavBar from './desktop';
import { withGetScreen } from 'react-getscreen';
import { useDispatch } from 'react-redux';
import { gaPageView } from 'utils';

const Navigation = ({isMobile, isTablet}) => {
	const dispatch = useDispatch();
	const { isAuthenticated, user } = UserSelectors();
	
	const logoutHandler = async () => {
		const response = await logout();
		if (response.status === 'OK') dispatch(notAuthenticated());
	};

	const location = useLocation();

	useEffect(() => {
		// tag page view
		gaPageView(location, isAuthenticated);
	}, [location, isAuthenticated]);
	
	return (
		<React.Fragment>
			{isMobile() || isTablet() ?
				<MobileNavBar logoutHandler={logoutHandler} user={user} isAuthenticated={isAuthenticated}/> :  
				<DesktopNavBar logoutHandler={logoutHandler} user={user} isAuthenticated={isAuthenticated}/>
			}
		</React.Fragment>
	);
};

Navigation.propTypes = {
	isMobile: PropTypes.func.isRequired,
	isTablet: PropTypes.func.isRequired
};

export default withGetScreen(Navigation, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });
