import { useTranslation } from 'locale/he_IL';
import React from 'react';
// import { Link, Typography } from 'shared';
import { device } from 'style';
import styled from 'styled-components';
import homepageMobileImage from '../../assets/homepage-mobile.svg';
import homepageImage from '../../assets/homepage.svg';
import SearchBox from './SearchBox';
import Banner from './Banner';

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
    line-height: 42px;
    padding-right: 16px;
    z-index: 1;
    margin-top: 0.1em;
    margin-bottom: 0.1em;
    font-weight: 600;

    @media ${device.tablet} {
        text-align: right;
        font-size: 56px;
        line-height: 64.5px;
        padding-right: 0;
        margin-top: 0;
        margin-bottom: 16px;
        background-color: rgb(252 249 255 / 85%);
        display: inline;
        font-weight: 700;
    }
`;

const H3 = styled.h3`
    text-align: center;
    color: #270E78;
    font-size: 24px;
    line-height: 30px;
    padding-right: 16px;
    z-index: 1;
    margin-top: 0.1em;
    margin-bottom: 0.1em;
    font-weight: 600;

    @media ${device.tablet} {
        text-align: right;
        font-size: 36px;
        line-height: 42px;
        padding-right: 0;
        margin-top: 0;
        margin-bottom: 16px;
        background-color: rgb(252 249 255 / 85%);
        width: 40%;
    }
`;

// const Paragraph = styled(Typography)`
//     width: 100%;
//     text-align: center;
//     font-size: 16px;
//     line-height: 24px;
//     max-width: 328px;
//     margin: 0.1em auto;
//     padding-right: 16px;
//     z-index: 1;

//     a {
//         font-size: 16px;
//     }

//     @media ${device.tablet} {
//         text-align: right;
//         margin: 24px 0 0;
//         max-width: 550px;
//         font-size: 20px;
//         padding-right: 0;
//         background-color: rgb(252 249 255 / 85%);

//         a {
//             font-size: 20px;
//         }
//     }
// `;

const TopSection = () => {
	const { t } = useTranslation();

	return (<>
		<Section>
			<Image/>
			<Cover>
                <H3>{t.homepageMainTopTitle}</H3>
				<H1>{t.homepageMainTitle}</H1>
				<SearchBox backgroundColor="#4D20B2" wrapperPadding="20px" />
			</Cover>
		</Section>
        <Banner/>
        </>
	);
};

export default TopSection;
