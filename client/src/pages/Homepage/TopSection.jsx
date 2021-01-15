import React from 'react';
import styled from 'styled-components';
import SearchBox from './SearchBox';
import homepageImage from '../../assets/homepage.svg';
import Typography from 'shared/typography';
import { device } from 'style';

const Image = styled.div`
    height: 223px;
    width: 100%;
    background-image: url(${homepageImage});
    background-repeat: no-repeat;
    background-size: cover;

    @media ${device.tablet} {
        position: absolute;
        left: 0;
        right: 0;
        height: 564px;
    }
`;

const Section = styled.section`
    width: 100%;
    margin-bottom: 20px;
    position: relative;

    @media ${device.tablet} {
        height: 564px;
    }
`;

const Cover = styled.div`
    @media ${device.tablet} {
        &:after, &:before {
            content: none;
        }
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(270deg, #FFFFFF 34.63%, rgba(196, 196, 196, 0) 63.08%);
        padding: 60px 80px 64px 0;
    }
`;

const H1 = styled.h1`
    width: 100%;
    text-align:right;
    color: #270E78;
    margin-top: 24px;
    margin-bottom: 0px;
    font-size: 36px;
    line-height: 54px;
    padding-right: 16px;

    @media ${device.tablet} {
        font-size: 48px;
        line-height: 60px;
        padding-right: 0;
    }
`;

const Paragraph = styled(Typography)`
    width: 100%;
    text-align: right;
    font-size: 16px;
    line-height: 24px;
    max-width: 328px;
    margin: 24px 0 0;
    padding-right: 16px;

    @media ${device.tablet} {
        margin: 0;
        margin-top: 24px;
        max-width: 495px;
        font-size: 18px;
        padding-right: 0;
    }

`;

const TopSection = () => {
	return (
		<Section>
			<Image/>
			<Cover>
                <H1>ברוכים הבאים למעירים!</H1>
                <Paragraph as='p'variant="paragraphText" mobileVariant="paragraphText">
                קהילת מעירים מאפשרת לכם לקבל מידע תכנוני על הנעשה בסביבה הקרובה שלכם, ללמוד על תוכניות ונושאים שמעניינים אתכם ולהיות פעילים, יחד עם רבים אחרים, בתהליכי התכנון והבנייה בארץ.
                </Paragraph>
                <SearchBox />
			</Cover>
		</Section>
	)
}

export default TopSection;