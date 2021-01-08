import React from 'react';
import TopSection from './TopSection';
import TopViews from './TopViews';
import WeNeedYou from './WeNeedYou';
import Wrapper from 'components/Wrapper';

const Homepage = () => {
	return (
		<Wrapper>
			<TopSection />
			<TopViews />
			<WeNeedYou />
		</Wrapper>
	)
}

export default Homepage;