import React from 'react';
import { withGetScreen } from 'react-getscreen';
import PropTypes from 'prop-types';
import { map, get } from 'lodash';
import styled from 'styled-components';
import features from '../../assets/features';
import purpleLogo from '../../assets/meirim-logo-purple.png';
import { device } from 'style';
import { useTranslation } from '../../locale/he_IL';

const DesktopImage = styled.img`
	@media ${device.tablet} {
		max-width: 100%; 
	}
`;

const PreviewImageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
	flex-direction: column;
	padding: 40px;	
	@media ${device.tablet} {
		flex-direction: row;
	}
`;

const MobileImg = styled.div`
	width: 100vw; 
	height: 420px;
	background-image: url(${props => props.src});
	background-repeat: no-repeat;
	background-position-x: right;
	background-size: cover;
	margin-bottom: 40px;
`;

const Feature = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 32px 60px 0px 29px;
	isolation: isolate;
	width: 332px;
	height: 240px;
	border-radius: 12px;
	flex: none;
	order: 1;
	align-self: stretch;
	flex-grow: 1;
	margin: 12px;
	background-color: ${props => props.color};
	background-image: url(${props => props.src});
	background-repeat: no-repeat;
  	background-size: auto;
	background-position: center bottom;
	font-size: 24px;
	font-weight: 600;
	line-height: 28px;
	letter-spacing: 0px;
	text-align: right;
`;

const MobileFeature = styled(Feature)`
`;

const DesktopFeature = styled(Feature)`
`;
	


// background-image: url(${props => props.color});

const Features = ({ isMobile, src, mobileSrc }) => {
	const { t } = useTranslation();
	return (
		<PreviewImageWrapper>
			{ map(features, (feature) => {
				const title = get(t, `features.${feature.titleKey}`);
				return isMobile() ? <MobileFeature src={mobileSrc ?? src}> { title } </MobileFeature> : <DesktopFeature src={feature.image} color={feature.backgroundColor}> { title } </DesktopFeature>
			})}
		</PreviewImageWrapper>
	);
};

Features.propTypes = {
	isMobile: PropTypes.func.isRequired,
	src: PropTypes.string.isRequired,
	mobileSrc: PropTypes.string,
};
  

export default withGetScreen(Features, { mobileLimit: 768 });