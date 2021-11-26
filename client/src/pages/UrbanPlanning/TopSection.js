import React from 'react';
import styled from 'styled-components';
import { device } from 'style';

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
    return (
        <Section>
            <H1>זה המקום שלכם ללמוד על תכנון ערים</H1>
            <P>
                עולם התכנון מבלבל אתכם? אנחנו כאן בשבילכם.
                <br /> בזכות שיתוף פעולה עם עמותת מרחב, מחכה לכם כאן מגוון
                סרטונים
                <br /> שיסבירו לכם מושגים ועקרונות שעומדים בלב התכנון והבניה.
            </P>
        </Section>
    );
}
