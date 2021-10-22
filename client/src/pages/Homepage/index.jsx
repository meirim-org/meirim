import Wrapper from 'components/Wrapper';
import React from 'react';
import { WeNeedYou } from 'shared';
import CommunityDiscussions from './CommunityDiscussions';
import TopSection from './TopSection';
import TopViews from './TopViews';

const Homepage = () => {
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