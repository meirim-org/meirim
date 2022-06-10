import React from 'react';
import styled from 'styled-components';
import YoutubeVideo from 'react-youtube';
import { useDispatch } from 'react-redux';
import { map } from 'lodash';
import { device } from 'style';
import { openModal } from 'redux/modal/slice';
import { Button } from '../../shared';
import { H2, CenteredCommonSection } from './style';
import { useTranslation } from 'locale/he_IL';

const fundingYoutubeVideoId = 'e1Q7zj_2f0I';


const VisionSection = styled(CenteredCommonSection)`
	padding-top: 60px;
	background-color: #FFFFFF;
	@media ${device.tablet} {
		display: flex;
	}
	padding-bottom: 45px;
`; 

const Wrapper = styled.div`
	align-items: center;
	flex-direction: column;
	width: 100%;
	max-width: 1368px;
	padding: 0 80px;
`;

const VideoContainer = styled.div`
	overflow: hidden;
	@media ${device.tablet} {
		width: 95%;
	}
`;
const VisionItemContainer = styled.div`
	width: 100%;
	padding: 20px;
	@media ${device.tablet} {
		display: flex;
		flex-flow: row;
		justify-content: space-evenly;
		max-width: 1248px;
	}
`;
const VisionItem = styled.div`
	@media ${device.tablet} {
		width: 100%;
	}
`; 

const RegisterNowContainer = styled.div`
	font-size: 24px;
	font-weight: 700;
	line-height: 36px;
	height: 100%;
	position: relative;
	min-height 300px;
	@media ${device.tablet} {
		width: 300px;
	}
`;

const RegisterNowTextLine = styled.div`
	font-size: 18px;
	font-weight: 400;
	line-height: 27px;
	display: flex;
	padding: 8px;
`;

const TickIcon = styled.span`
	display: inline-block;
	transform: rotate(45deg);
	height: 12px;
	width: 6px;
	border-bottom: 2.5px solid white;
	border-right: 2.5px solid white;
`;

const TickIconWrapper = styled.div`
	display: inline-block;
	background-color: #8F5CE2;
	width: 24px;
	border: 2px solid #AE7FF0;
	border-radius: 50%;
	display: flex;
    justify-content: center;
	align-items: center;
	margin-left: 14px;
	overflow: hidden;
`;

const RegisterButtonContainer = styled.div`
	bottom: 5px;
	width: 100%;
	position: absolute;
`;

const TickCircle = () => {
	return <TickIconWrapper>
		<TickIcon/>
	</TickIconWrapper>
}; 

const VisionTextItem = ({text}) => {
	return <RegisterNowTextLine>
		< TickCircle/>
		{text}
	</RegisterNowTextLine>
}


const RegisterNowTexts = ['קבלו התראות בזמן אמת', 'תוכניות עירוניות חדשות', 'מדויק לכתובת שלכם', 'העדפות גיאוגרפיות נוספות'];

const Vision = () => {

	const { t } = useTranslation();
	const dispatch = useDispatch();

	return (
	<VisionSection>
		<Wrapper>
		<H2>החזון שלנו</H2>
			<VisionItemContainer>
				<VisionItem>
					<VideoContainer>
						<YoutubeVideo videoId={fundingYoutubeVideoId}/>
					</VideoContainer>
				</VisionItem>
				<VisionItem>
					<RegisterNowContainer>
						הרשמו לשירות שלנו בחינם
						{map(RegisterNowTexts, (text, index) => <VisionTextItem text={text} key={`vision-text-${index}`} />)}
						<RegisterButtonContainer>
							<Button
							onClick={() => {
								dispatch(openModal({ modalType: 'register' }));
							}}
							width= '100%'
							id="register-button-vision"
							key={t.signup}
							text={t.signup}
							type={'primary'}
						/>
					</RegisterButtonContainer>
					</RegisterNowContainer>
				</VisionItem>
			</VisionItemContainer>
			</Wrapper>
		</VisionSection>
	);
};

export default Vision;