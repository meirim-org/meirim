import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { device } from 'style';
import styled from 'styled-components';

const Section = styled.div`
	width: 100%;
	max-width: 1000px;
	margin: 16px 0 0 0;
	background-color: #e53935;
	color: white;
	font-size: 24px;
	line-height: 30px;
	font-weight: 600;
	padding: 12px 24px;
	border-radius: 18px;
	text-align: right;
	z-index: 1000;
	margin-right: 32px;
    align-self: center;
    justify-self: center;

	@media ${device.tablet} {
		font-size: 32px;
		line-height: 40px;
		font-weight: 700;
		padding: 12px 32px;
		margin-top: 24px;
		margin-right: 80px;
	}
`;

const ErrorBanner = () => {
    const { t } = useTranslation();

    return (
        <Section>
            {t.websiteUnavailable}
        </Section>
    );
};

export default ErrorBanner;

