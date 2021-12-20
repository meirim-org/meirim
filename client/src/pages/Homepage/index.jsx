import Wrapper from 'components/Wrapper';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { WeNeedYou } from 'shared';
import CommunityDiscussions from './CommunityDiscussions';
import TopSection from './TopSection';
import TopViews from './TopViews';
import { openModal } from 'redux/modal/slice';
import { UserSelectors } from 'redux/selectors';

const Homepage = () => {

	const location = useLocation();
	const dispatch = useDispatch();
	const { isAuthenticated } = UserSelectors();

	useEffect(() => {
		if (location.hash === '#openRegister' &&  !isAuthenticated) {
			dispatch(openModal({ modalType: 'register' }));
		}
	}, [location, dispatch]);

	return (
		<Wrapper>
			<TopSection />
			<TopViews />
			<WeNeedYou />
			<CommunityDiscussions />
		</Wrapper>
	);
};

export default Homepage;