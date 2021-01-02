import React from 'react';
import styled from 'styled-components';
import TopSection from './TopSection';
import TopViews from './TopViews';
import WeNeedYou from './WeNeedYou';

const Wrapper = styled.div`
    width: 100%;
    max-width: 1441px;
    margin: 0 auto;
`;

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