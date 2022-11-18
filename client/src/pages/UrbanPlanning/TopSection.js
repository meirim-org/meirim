import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'locale/he_IL';

const Section = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 343px;
    margin-bottom: -55px;
    padding-bottom: 55px;
    background: #faf6fe;
`;

const H1 = styled.h1`
    font-weight: bold;
    color: #270e78;
`;

const P = styled.p`
    text-align: center;
    font-size: 18px;
`;

export default function TopSection(params) {
    const { t } = useTranslation();

    return (
        <Section>
            <H1>{t.urbanPlanningTitle}</H1>
            <P>{t.urbanPlanningSubtitle}</P>
        </Section>
    );
}
