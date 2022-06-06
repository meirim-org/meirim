import React from 'react';
import { withGetScreen } from 'react-getscreen';
import { map } from 'lodash';
import styled from 'styled-components';
import { H2, CommonSection } from './style';
import { device } from 'style';

const achievements = [{
	title: 'משתמשים רשומים',
	value: 6500
}, {
	title: 'מבקרים חדשים בחודש',
	value: 7000
}, {
	title: 'התראות שנשלחו',
	value: 150000
}, {
	title: 'עצים שהצלנו מכריתה',
	value: 3000
}];

const AchievementSection = styled(CommonSection)`
	background-color: #FCF9FF;
	padding-bottom: 30px;
	@media ${device.tablet} {
		padding-bottom: 200px;
	}
`;


const Wrapper = styled.div`
    width: 100%;
	display: flex;
    flex-flow: row wrap;
    justify-content: center;
    position: relative;
	align-items: center;
	@media ${device.tablet} {
		flex-direction: row;
		flex-flow: row no-wrap;
	}
`;

const StatTitle = styled.div`
	font-weight: 700;
	font-size: 20px;
	line-height: 26px;
	color: #918899;
	align-self: center;
`;

const StatValue = styled.div`
	font-weight: 600;
	font-size: 36px;
	line-height: 48px;
	color: #652DD0;
	align-self: right;
	@media ${device.tablet} {
		font-size: 64px;
		line-height: 90px;
	}
`;

const StatContainer = styled.div`
	width: 50%;
	display: flex;
    flex-direction: column;
    align-items: center;
	@media ${device.tablet} {
		width: 190px;
		margin: 0px 20px;
	}
`;


const Stat = ({ title, value }) => {
	return <StatContainer> 
		<StatValue>  {value.toLocaleString('en')}</StatValue>
		<StatTitle>  {title}</StatTitle>
	</StatContainer>;
};

const Achievements = () => {
	return (
		<AchievementSection>
			<H2>מה השגנו יחד</H2>
		<Wrapper>
			{ map(achievements, ({ title, value }) => <Stat title={title} value={value} />)}
		</Wrapper>
		</AchievementSection>
	);
};
  

export default withGetScreen(Achievements, { mobileLimit: 768 });