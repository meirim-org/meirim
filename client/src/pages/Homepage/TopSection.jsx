import React from 'react';
import styled from 'styled-components';
import SearchBox from './SearchBox';
import homepageImage from '../../assets/homepage-desktop.png';

const Image = styled.div`
    position: relative;
    background-image: url(${homepageImage});
    background-repeat: no-repeat;
    width: 100%;
    height: 564px;
`;

const Section = styled.section`
    width: 100%;
    margin-bottom: 20px;
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

const Paragraph = styled.p`
    margin-top: 24px;
    max-width: 495px;
    font-family: Assistant;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 27px;
    text-align: right;
`;

const TopSection = () => {
	return (
		<Section>
			<Image>
				<Cover>
					<H1>ברוכים הבאים למעירים!</H1>
					<Paragraph>
                    קהילת מעירים מאפשרת לכם לקבל מידע תכנוני על הנעשה בסביבה הקרובה שלכם, ללמוד על תוכניות ונושאים שמעניינים אתכם ולהיות פעילים, יחד עם רבים אחרים, בתהליכי התכנון והבנייה בארץ.
					</Paragraph>
					<SearchBox />
				</Cover>
			</Image>
		</Section>
	)
}

export default TopSection;