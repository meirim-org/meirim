import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { device } from 'style';
import styled from 'styled-components';

const Section = styled.div`
    width: 100%;
    position: relative;
	background: #11D08F;
	font-size: 20px;
	line-height: 130%;
	text-align: center;
	font-weight: 500;
	padding: 24px;

    @media ${device.tablet} {
		padding: 16px;
    }
`;

const Banner = () => {
	const { t } = useTranslation();

	return (
		<Section>
			{t.homepageBanner}
		</Section>
	);
};

export default Banner;