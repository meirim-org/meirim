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

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
	flex-direction: column;
	@media ${device.tablet} {
		flex-direction: row;
		padding: 40px;	
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

const FeatureWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	isolation: isolate;
	width: 332px;
	height: 240px;
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
	border-radius: 12px;
	@media ${device.tablet} {
		padding-buttom: 12px;
	}
`;

const DesktopMoreInfo = styled.div`
	background-color: white;
	height: 37px;
	color: #652DD0;
	width: 85%;
	border-radius: 16px;
	font-size: 16px;
	font-weight: 700;
	line-height: 21px;
	letter-spacing: 0px;
	text-align: center;
	padding: 7px;
	display: none;
	margin: 12px;

	${FeatureWrapper}:hover & {
		display: block;
	}
`;

const MobileMoreInfo = styled.div`
	background-color: #652DD0;
	color: white;
	height: 37px;
	width: 100%;
	font-size: 16px;
	font-weight: 700;
	line-height: 21px;
	letter-spacing: 0px;
	text-align: center;
	padding: 7px;
	display: block;
`;

const TitleWrapper = styled.div`
	margin: 32px 20px 0 30px;
`;


const Feature = ({ imgSrc, titleKey, color, isMobile }) => {
	const { t } = useTranslation();
	const title = get(t.features, titleKey);

	return <FeatureWrapper color={color} src={imgSrc} isMobile={isMobile}> 
		<TitleWrapper> { title } </TitleWrapper>
		{ !isMobile && <DesktopMoreInfo> {t.moreInfo} </DesktopMoreInfo> }
		{ isMobile && <MobileMoreInfo> {t.moreInfo}  </MobileMoreInfo> }

	</FeatureWrapper>;
};

const Features = ({ isMobile, src, mobileSrc }) => {
	const { t } = useTranslation();
	const mobile = isMobile();
	return (
		<Wrapper>
			{ map(features, ({ image, backgroundColor, titleKey }) => {
				// let isMobile = isMobile() || false;
				return <Feature imgSrc={image} color={backgroundColor} titleKey={titleKey} isMobile={mobile}/>;
			})}
		</Wrapper>
	);
};

Features.propTypes = {
	isMobile: PropTypes.func.isRequired,
	src: PropTypes.string.isRequired,
	mobileSrc: PropTypes.string,
};
  

export default withGetScreen(Features, { mobileLimit: 768 });