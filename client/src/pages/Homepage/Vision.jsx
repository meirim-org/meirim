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
import Tick from '../../assets/svg/tick';

const fundingYoutubeVideoId = 'e1Q7zj_2f0I';

const StyledH2 = styled(H2)`
	align-self: center;
	@media ${device.tablet} {
		align-self: unset;
	}
`;


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
	padding: 0 10px;
	@media ${device.tablet} {
		max-width: 1368px;
		padding: 0 80px;
	}
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
	max-width: calc(50%-10px);
	overflow: hidden;
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
		width:100%;
	}
`;

const RegisterNowTextLine = styled.div`
	font-size: 18px;
	font-weight: 400;
	line-height: 27px;
	display: flex;
	padding: 8px;

	& > p {
		margin-right: 10px;
		margin-bottom: 10px;
	}
`;

const RegisterButtonContainer = styled.div`
	bottom: 5px;
	width: 100%;
	position: absolute;
`;

const VisionTextItem = ({text}) => {
	return <RegisterNowTextLine>
		< Tick/>
		<p>{text}</p>
	</RegisterNowTextLine>
}


const RegisterNowTexts = ['קבלו התראות בזמן אמת', 'תוכניות עירוניות חדשות', 'מדויק לכתובת שלכם', 'העדפות גיאוגרפיות נוספות'];

const Vision = () => {

	const { t } = useTranslation();
	const dispatch = useDispatch();

	return (
	<VisionSection>
		<Wrapper>
		<StyledH2>החזון שלנו</StyledH2>
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