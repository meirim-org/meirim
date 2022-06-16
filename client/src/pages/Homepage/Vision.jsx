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
import Man from '../../assets/svg/cleaningMan.svg';

const fundingYoutubeVideoId = 'e1Q7zj_2f0I';

const StyledH2 = styled(H2)`
	align-self: center;
	@media ${device.tablet} {
		align-self: baseline;
	}
`;


const VisionSection = styled(CenteredCommonSection)`
	padding-top: 60px;
	background-color: #FFFFFF;
	@media ${device.tablet} {
		display: flex;
		min-height: 350px;
	}
	padding-bottom: 45px;
`;

const Wrapper = styled.div`
	align-items: center;
	flex-direction: column;
	width: 100%;
	padding: 0 10px;
	display: flex;
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
		justify-content: space-evenly;
		max-width: 1248px;
	}
`;
const VisionItem = styled.div`
	@media ${device.tablet} {
		width: 50%;
		display: flex;
		justify-content: space-between;
	}
`;

const RegisterNowContainer = styled.div`
	font-size: 24px;
	font-weight: 700;
	line-height: 36px;
	height: 100%;
	position: relative;
	min-height 300px;
	display: flex;
	flex-direction: column;
	@media ${device.tablet} {
		min-width: 300px;
	}
`;

const RegisterNowTextLine = styled.div`
	font-size: 16px;
	line-height: 20px;
	font-weight: 400;
	display: flex;
	padding: 8px;
	@media ${device.tablet} {
		font-size: 18px;
		line-height: 27px;
	}

	& > p {
		margin-right: 10px;
		margin-bottom: 10px;
	}
`;

const RegisterButtonContainer = styled.div`
	bottom: 5px;
	width: 90%;
	align-self: center;
	position: absolute;
	margin-top:200px;
	@media ${device.tablet} {
		margin-top:0px;
		width: 100%;
		max-width: 250px;
		align-self: self-start
	}
`;

const ManGraphic = styled.div`
  background-image: url(${Man});
  background-size: auto;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 10%;

  display: none;

  @media ${device.laptop} {
    height: 350px;
    width: 200px;
	display: block;
  }
`;

const VisionTextItem = ({text}) => {
	return <RegisterNowTextLine>
		< Tick/>
		<p>{text}</p>
	</RegisterNowTextLine>
}


const RegisterNowTexts = ['קבלו התראות בזמן אמת', 'כל סוגי התוכניות', 'מדויק לכתובת שלכם', 'והשפיעו כשעוד ניתן!'];

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
						<YoutubeVideo videoId={fundingYoutubeVideoId} opts={{width: '100%'}}/>
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
					<ManGraphic/>
				</VisionItem>
			</VisionItemContainer>
			</Wrapper>
		</VisionSection>
	);
};

export default Vision;