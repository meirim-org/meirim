import React from 'react';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import Preview from './Preview';
import topPlansImage from '../../assets/top-plans.svg';

const CommunityDiscussionsSection = styled(CommonSection)``; 
const CommunityDiscussionsImage = styled.img.attrs(()=>({ src: topPlansImage }))` max-width: 100%; `;

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