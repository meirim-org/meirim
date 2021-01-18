import React from 'react';
import styled from 'styled-components';
import SearchBox from './SearchBox';
import homepageImage from '../../assets/homepage.svg';
import homepageMobileImage from '../../assets/homepage-mobile.svg'
import Typography from 'shared/typography';
import { device } from 'style';

const Image = styled.div`
    height: 288px;
    width: 100%;
    background-image: url(${homepageMobileImage});
    background-color: #FCF9FF;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    @media ${device.tablet} {
        background-image: url(${homepageImage});
        background-size: auto;
        position: absolute;
        left: 0;
        right: 0;
        height: 588px;
        background-position: inherit;
    }
`;

const Cover = styled.div`
    @media ${device.tablet} {
        position: absolute;
        left:0; top: 0; right: 0; bottom: 0;
        padding-top: 132px;
        padding-right: 80px;
    }
`;

const Section = styled.section`
    width: 100%;
    margin-bottom: 20px;
    position: relative;

    @media ${device.tablet} {
        height: 588px;
        background: #FCF9FF;
    }
`;

const H1 = styled.h1`
    width: 100%;
    text-align: center;
    color: #270E78;
    font-size: 36px;
    line-height: 54px;
    padding-right: 16px;
    z-index: 1;
    margin-top: 20px;
    margin-bottom: 24px;

    @media ${device.tablet} {
        text-align: right;
        font-size: 48px;
        line-height: 60px;
        padding-right: 0;
        margin-top: 0;
        margin-bottom: 16px;
        background-color: #FCF9FF;
        display: inline;
    }
`;

const Paragraph = styled(Typography)`
    width: 100%;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    max-width: 328px;
    margin: 24px auto;
    padding-right: 16px;
    z-index: 1;

    @media ${device.tablet} {
        text-align: right;
        margin: 24px 0 0;
        max-width: 495px;
        font-size: 20px;
        padding-right: 0;
        background-color: #FCF9FF;
    }

`;

const TopSection = () => {
	return (
		<Section>
			<Image/>
            <Cover>
                <H1>ברוכים הבאים למעירים!</H1>
                <Paragraph as="p" variant="paragraphText" mobileVariant="paragraphText">
                קהילת מעירים מאפשרת לכם לקבל מידע תכנוני על הנעשה בסביבה הקרובה שלכם, ללמוד על תוכניות ונושאים שמעניינים אתכם ולהיות פעילים, יחד עם רבים אחרים, בתהליכי התכנון והבנייה בארץ.
                </Paragraph>
                <SearchBox />
            </Cover>
		</Section>
	)
}

export default TopSection;