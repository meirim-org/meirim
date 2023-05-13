import Wrapper from 'components/Wrapper';
import React from 'react';
import TopSection from './TopSection';
import Videos from './Videos';

const Homepage = () => {
	return (
		<Wrapper hideFooter={true}>
			<TopSection/>
            <Videos/>
		</Wrapper>
	);
};

export default Homepage;