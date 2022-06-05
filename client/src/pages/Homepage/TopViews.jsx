import React from 'react';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import { device } from '../../style';
import Features from './Features';
import topPlansImage from '../../assets/top-plans.svg';

const TopViewsSection = styled(CommonSection)`
`;

const TopViews = () => {

	return ( <TopViewsSection>
		<H2>אז איך זה עובד?</H2>
			<Features src={topPlansImage}>
			</Features>
		</TopViewsSection>
	);
};

export default TopViews;
