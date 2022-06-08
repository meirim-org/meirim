import React from 'react';
import { withGetScreen } from 'react-getscreen';
import styled from 'styled-components';
import { CommonSection } from './style';
import { device } from 'style';
import SearchBox from './SearchBox';


const Section = styled(CommonSection)`
	background-color: #391695;
	position: relative;
	display: flex;
`;

const CustomButton = styled.div`
	font-size: 16px;
	line-height: 120%;
	text-align: center;
	color: #F0E3FD;
	border-radius: 4px;
	border: 1px solid #F0E3FD;
	padding: 10px 20px;
	margin-top: 20px;
`;

const ActionWrapper = styled.div`
	width: 230px;
	color: #F0E3FD;
	font-weight: 600;
	font-size: 24px;
	line-height: 28px;
	text-align: center;
	height: 100px;
	margin: 10px 30px;
	padding: 20px 0;
	cursor: pointer;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
	flex-direction: column;
	align-items: center;
	padding: 70px 0px ;

	@media ${device.tablet} {
		flex-direction: row; 
	}
`;


const Footer = ({isMobile}) => {
	return (<>
		<Section>
		<Wrapper>
			<ActionWrapper>
				רוצים להישאר מעודכנים?
				<CustomButton> הרשמו עכשיו </CustomButton>
			</ActionWrapper>
			<ActionWrapper>
				מגינים על הסביבה?
				<CustomButton> מנעו כריתת עצים </CustomButton>
			</ActionWrapper>
			{!isMobile() && <SearchBox backgroundColor="#391695" />}
			</Wrapper>
		</Section>
		</>
	);
};
  

export default withGetScreen(Footer, { mobileLimit: 768 });