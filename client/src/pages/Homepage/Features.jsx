import React from 'react';
import { withGetScreen } from 'react-getscreen';
import PropTypes from 'prop-types';
import { map, get } from 'lodash';
import styled from 'styled-components';
import features from '../../assets/features';
import { device } from 'style';
import { useTranslation } from '../../locale/he_IL';


const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
	flex-direction: column;
	@media ${device.tablet} {
		flex-direction: row;
	}
`;

const FeatureWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	isolation: isolate;
	width: 100%px;
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
	max-width: 332px;
	@media ${device.tablet} {
		padding-buttom: 12px;
		width: 332px;
		height: 240px;
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
	cursor: pointer;

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
	cursor: pointer;
`;

const TitleWrapper = styled.div`
	margin: 24px 20px 0 30px;
	@media ${device.tablet} {
		margin: 32px 20px 0 30px;
	}
`;


const Feature = ({ imgSrc, titleKey, color, isMobile, onClick }) => {
	const { t } = useTranslation();
	const title = get(t.features, titleKey);

	return <FeatureWrapper onClick={onClick} color={color} src={imgSrc} isMobile={isMobile}> 
		<TitleWrapper> { title } </TitleWrapper>
		{ !isMobile && <DesktopMoreInfo> {t.moreInfo} </DesktopMoreInfo> }
		{ isMobile && <MobileMoreInfo> {t.moreInfo}  </MobileMoreInfo> }

	</FeatureWrapper>;
};

const Features = ({ isMobile, src, mobileSrc }) => {
	const { t } = useTranslation();
	const mobile = isMobile();

	const setFeatureHash = (featureKey) => {
		window.location.hash = `campaign-feature-${featureKey}`;
	};

	return (
		<Wrapper>
			{ map(features, ({ image, backgroundColor, titleKey }) => {
				// let isMobile = isMobile() || false;
				return <Feature onClick={()=>setFeatureHash(titleKey)} imgSrc={image} color={backgroundColor} titleKey={titleKey} isMobile={mobile}/>;
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