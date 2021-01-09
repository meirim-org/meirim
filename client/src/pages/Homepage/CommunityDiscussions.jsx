import React from 'react';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import Preview from './Preview';
import communityDiscussionsImage from '../../assets/community-discussions.svg';
import { device } from 'style';

const CommunityDiscussionsSection = styled(CommonSection)`
	margin-top: 60px;
`; 
const CommunityDiscussionsImage = styled.img.attrs(()=>({ src: communityDiscussionsImage }))`
	@media ${device.tablet} {
		max-width: 100%; 
	}
`;

const CommunityDiscussions = () => {

	return (
		<CommunityDiscussionsSection>
			<H2>דיונים בקהילה</H2>
			<Preview>
				<CommunityDiscussionsImage />
			</Preview>
		</CommunityDiscussionsSection>
	)
}

export default CommunityDiscussions;