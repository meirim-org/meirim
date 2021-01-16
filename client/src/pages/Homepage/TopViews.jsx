import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import Preview from './Preview';
import topPlansImage from '../../assets/top-plans.svg';

const TopViewsSection = styled(CommonSection)``; 

const TopViews = () => {

	return (
		<TopViewsSection>
			<H2>התוכניות הכי נצפות השבוע</H2>
			<Preview src={topPlansImage}>
			</Preview>
		</TopViewsSection>
	);
};

TopViews.propTypes = {
	isMobile: PropTypes.func.isRequired,
};

export default TopViews;