import React from 'react';
import styled from 'styled-components';
import { CommonSection } from './style';
import supportUs from '../../assets/support-us.svg';

const Box = styled.div`
    background: #F0E3FD;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15), 0px 6.91436px 8.83705px rgba(0, 0, 0, 0.025);
    border-radius: 12px;
    width: 1236px;
    height: 164px;
    margin: 0 auto;
    display: flex;
`;

const WeNeedYouSection = styled(CommonSection)``;

const Content = styled.div`
    margin-right: 40px;
    padding: 32px 0 32px 32px;
    flex: 1;
    display: flex;
`;

const Title = styled.h2`
    font-weight: 600;
    font-size: 32px;
    line-height: 32px;
    text-align: right;
    color: #270E78;
    margin: 0;
    padding: 0;
    margin-bottom: 16px;
`;

const Message = styled.p`
    font-size: 18px;
    line-height: 27px;
    text-align: right;
    color: #270E78;
    max-width: 800px;
`;

const Button = styled.button`
    width: 120px;
    height: 32px;
    background: linear-gradient(0deg, #652DD0, #652DD0);
    border-radius: 12px;
    line-height: 32px;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    margin-right: auto;
    margin-top: auto;
    &:focus {
        outline: none;
    }
    border: 0;
    cursor: pointer;
`;

const WeNeedYou = () => (
	<WeNeedYouSection>
		<Box>
			<img src={supportUs} alt="support us" />
			<Content>
                <div>
                    <Title>אנחנו צריכים אתכם!</Title>
                    <Message>יחד איתכם נוכל להציף תוכניות, להנגיש את המידע התכנוני, לקדם דו שיח, ולהרחיב את המעורבות של כולנו במערכת התכנון.</Message>
                </div>
                <Button>לתמיכה</Button>
			</Content>
		</Box>
	</WeNeedYouSection>
);

export default WeNeedYou;