import React from 'react';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import Preview from './Preview';
import topPlansImage from '../../assets/top-plans.svg';

const TopViewsSection = styled(CommonSection)``; 
const TopPlansImage = styled.img.attrs(()=>({ src: topPlansImage }))` max-width: 100%; `;

const TopViews = () => {

	return (
		<TopViewsSection>
			<H2>התוכניות הכי נצפות השבוע</H2>
			<Preview>
				<TopPlansImage />
			</Preview>
		</TopViewsSection>
	)
}

export default TopViews;