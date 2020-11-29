import React from 'react';
import { Hidden } from '@material-ui/core';
import { UserSelectors } from 'redux/selectors'
import MobileNavBar from './mobile'
import DesktopNavBar from './desktop';

const Navigation = () => {
	const { isAuthenticated, user } = UserSelectors()
	
	return (
		<React.Fragment>
			<Hidden mdUp> <MobileNavBar user={user} isAuthenticated={isAuthenticated}/></Hidden>
			<Hidden mdDown> <DesktopNavBar user={user} isAuthenticated={isAuthenticated}/></Hidden>
		</React.Fragment>
	);
}

export default Navigation;
