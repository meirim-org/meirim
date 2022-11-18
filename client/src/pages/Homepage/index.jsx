import Wrapper from 'components/Wrapper';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reportToAnalytics } from 'utils';
import Vision from './Vision';
import Features from './Features';
import Achievements from './Achievements';
import Testimony from './Testimony';
import CallToActionFooter from './CallToActionFooter';
import TopSection from './TopSection';
import { openModal } from 'redux/modal/slice';
import { UserSelectors } from 'redux/selectors';

const Homepage = () => {

	const location = useLocation();
	const dispatch = useDispatch();
	const { isAuthenticated } = UserSelectors();

	useEffect(() => {
		if (location.hash === '#openRegister' &&  !isAuthenticated) {
			reportToAnalytics({
				event: 'registration-start',
				ref: 'popup'
			});
			dispatch(openModal({ modalType: 'register' }));
		}
	}, [location, isAuthenticated, dispatch]);

	return (
		<Wrapper>
			<TopSection />
			<Features />
			<Vision />
			<Achievements/>
			<Testimony />
			<CallToActionFooter />
		</Wrapper>
	);
};

export default Homepage;