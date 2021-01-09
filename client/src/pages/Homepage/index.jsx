import React from 'react';
import TopSection from './TopSection';
import TopViews from './TopViews';
import WeNeedYou from './WeNeedYou';
import CommunityDiscussions from './CommunityDiscussions';
import Wrapper from 'components/Wrapper';

const Homepage = () => {
	return (
		<Wrapper>
			<TopSection />
			<TopViews />
			<WeNeedYou />
			<CommunityDiscussions />
		</Wrapper>
	)
}

export default Homepage;