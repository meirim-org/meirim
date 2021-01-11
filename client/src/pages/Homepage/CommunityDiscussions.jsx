import React from 'react';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import Preview from './Preview';
import communityDiscussionsImage from '../../assets/community-discussions.svg';

const CommunityDiscussionsSection = styled(CommonSection)`
	margin-top: 60px;
`; 

const CommunityDiscussions = () => {

	return (
		<CommunityDiscussionsSection>
			<H2>דיונים בקהילה</H2>
			<Preview src={communityDiscussionsImage} />
		</CommunityDiscussionsSection>
	);
};

export default CommunityDiscussions;