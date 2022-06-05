import React from 'react';
import { withGetScreen } from 'react-getscreen';
import { map } from 'lodash';
import styled from 'styled-components';
import { CommonSection } from './style';
import { device } from 'style';
import QuoteVector from '../../assets/svg/quote';
import Newspaper from '../../assets/svg/newspaper';

const testimonies = [{
	text: 'זה לא היה קורה בלי הפעילות שלכם ותודה',
	person: 'שחר רוזנק',
	personTitles: 'מנהלת שיתוף ציבור, מנהל התכנון'
}, {
	text: 'למדנו כמה דברים טובים ממעירים',
	person: `אד׳ ארז בן אליעזר`,
	personTitles: 'מתכנן מחוז תל אביב'
}];

const TestimonySection = styled(CommonSection)`
	background-color: #391695;
	position: relative;
	display: flex;
`;


const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
	flex-direction: column;
	align-items: center;
	padding: 50px 0px ;
	@media ${device.tablet} {
		flex-direction: row;
		padding: 250px 0px 50px 0px ;
	}
`;

const Text = styled.div`
	font-weight: 700;
	font-size: 36px;
	line-height: 120%;
	text-align: center;
	color: #FFFFFF;
	padding-bottom: 12px;
`;
const PersonText = styled.div`
	font-weight: 700;
	font-size: 20px;
	line-height: 130%;
	color: #CFABFA;
`;

const PersonTitle = styled(PersonText)`
	font-weight: 600;
`;

const TestimonyContainer = styled.div`
	width: 332px;
	display: flex;
    flex-direction: column;
    align-items: center;
	padding-bottom:12px;

	& > svg {
		align-self: self-start;
	}
`;

const NewspaperContainer = styled.div`
	display: none;
	@media ${device.tablet} {
		position: absolute;
		top: -210px;
		display: flex;
		justify-content: center;
		width: 100%;
	}
	& > svg {
		align-self: center;
	}
`;


const Testimony = ({ text, person, personTitle }) => {
	return <TestimonyContainer> 
			<QuoteVector/>
		<Text>  {text}</Text>
		<PersonText>  {person} </PersonText>
		<PersonTitle> {personTitle}</PersonTitle>
	</TestimonyContainer>;
};

const Achievements = ({ }) => {
	return (<>
		<TestimonySection>
			<NewspaperContainer><Newspaper /></NewspaperContainer>
		<Wrapper>
			{ map(testimonies, ({ text, person, personTitles }) => {
				return <Testimony text={text} person={person} personTitle={personTitles} />;
			})}
		</Wrapper>
		</TestimonySection>
		</>
	);
};
  

export default withGetScreen(Achievements, { mobileLimit: 768 });