import React from 'react';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import Preview from './Preview';
import communityDiscussionsImage from '../../assets/community-discussions.svg';
import communityDiscussionsImageMobile from '../../assets/community-discussions-mobile.svg';


const CommunityDiscussionsSection = styled(CommonSection)`
	margin-top: 60px;
`; 

const CommunityDiscussions = () => {

	return (
		<CommunityDiscussionsSection>
			<H2>דיונים בקהילה</H2>
			<Preview src={communityDiscussionsImage} mobileSrc={communityDiscussionsImageMobile} />
		</CommunityDiscussionsSection>
	);
};

export default CommunityDiscussions;