import React from 'react';
import { notAuthenticated } from 'redux/user/slice';
import { logout } from 'services/user'
import { UserSelectors } from 'redux/selectors'
import MobileNavBar from './mobile'
import DesktopNavBar from './desktop';
import { withGetScreen } from 'react-getscreen'
import { useDispatch } from 'react-redux';

const Navigation = (props) => {
	const dispatch = useDispatch()
	console.log('🚀 ~ file: index.jsx ~ line 28 ~ Navigation ~ props', props)
	const { isAuthenticated, user } = UserSelectors()
	
	const logoutHandler = async () => {
		const response = await logout()
		if (response.status === 'OK') dispatch(notAuthenticated())
	}
	
	return (
		<React.Fragment>
			{props.isMobile() ? 
				<MobileNavBar logoutHandler={logoutHandler} user={user} isAuthenticated={isAuthenticated}/> :  
				<DesktopNavBar logoutHandler={logoutHandler} user={user} isAuthenticated={isAuthenticated}/>
			}
		</React.Fragment>
	);
}

export default withGetScreen(Navigation);
