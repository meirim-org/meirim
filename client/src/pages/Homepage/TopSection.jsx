import React from 'react';
import styled from 'styled-components';
import SearchBox from './SearchBox';
import homepageImage from '../../assets/homepage-desktop.png';
import Typography from 'shared/typography';

const Image = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    background-image: url(${homepageImage});
    background-repeat: no-repeat;
    height: 564px;
`;

const Section = styled.section`
    width: 100%;
    margin-bottom: 20px;
    position: relative;
    height: 564px;
`;

const Cover = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(270deg, #FFFFFF 34.63%, rgba(196, 196, 196, 0) 63.08%);
    padding: 60px 80px 64px 0;
`;

const H1 = styled.h1`
    font-family: Assistant;
    font-style: normal;
    font-weight: normal;
    font-size: 48px;
    line-height: 60px;
    text-align: right;
    color: #270E78;
`;

const Paragraph = styled(Typography)`
    margin-top: 24px;
    max-width: 495px;
    font-size: 18px;
`;

const TopSection = () => {
	return (
		<Section>
			<Image/>
			<Cover>
                <Typography as="h1" color="#270E78" variant="megaHeadTitle" mobileVariant="megaHeadTitle">ברוכים הבאים למעירים!</Typography>
                <Paragraph as='p'variant="paragraphText" mobileVariant="paragraphText">
                קהילת מעירים מאפשרת לכם לקבל מידע תכנוני על הנעשה בסביבה הקרובה שלכם, ללמוד על תוכניות ונושאים שמעניינים אתכם ולהיות פעילים, יחד עם רבים אחרים, בתהליכי התכנון והבנייה בארץ.
                </Paragraph>
                <SearchBox />
			</Cover>
		</Section>
	)
}

export default TopSection;