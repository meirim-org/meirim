import React from 'react';
import { withGetScreen } from 'react-getscreen';
import PropTypes from 'prop-types';
import { map, get } from 'lodash';
import { device } from 'style';
import styled from 'styled-components';
import features from '../../assets/features';
import { H2, CenteredCommonSection } from './style';
import { useTranslation } from '../../locale/he_IL';

const FeatureSection = styled(CenteredCommonSection)`
	padding-top: 20px;
	background-color: #FFFFFF;
	@media ${device.tablet} {
		display: flex;
	}
`; 

const Wrapper = styled.div`
	align-items: center;
	flex-direction: column;
	padding: 0 10px;
	@media ${device.tablet} {
		max-width: 1368px;
		padding: 0 80px;
	}
`;

const FeaturesWrapper = styled.div`
	@media ${device.tablet} {
		display: flex;
		flex-flow: row wrap;

		&:first-child {
			margin-right: 0px;
		}
	}

`;

const FeatureWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	width: 100%;
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
	align-self: center;
	border-radius: 12px;
	max-width: 332px;
	@media ${device.tablet} {
		height: 240px;
	}

	@media ${device.laptop} {
		width: 20%;
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
	const mobile = isMobile();

	const setFeatureHash = (featureKey) => {
		window.location.hash = `campaign-feature-${featureKey}`;
	};

	return (
		<FeatureSection>
		<Wrapper>
			<H2> איך זה עובד</H2>
			<FeaturesWrapper>
				{ map(features, ({ image, backgroundColor, titleKey }) => {
					return <Feature onClick={()=>setFeatureHash(titleKey)} imgSrc={image} color={backgroundColor} titleKey={titleKey} isMobile={mobile}/>;
				})}
			</FeaturesWrapper>
		</Wrapper>
		</FeatureSection>
	);
};

Features.propTypes = {
	isMobile: PropTypes.func.isRequired,
	src: PropTypes.string.isRequired,
	mobileSrc: PropTypes.string,
};
  

export default withGetScreen(Features, { mobileLimit: 768 });