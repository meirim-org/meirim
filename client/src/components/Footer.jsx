import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    padding: 2rem 1rem;
    line-height: 1.8;

	a {
		color: #652DD0;
	}
`;

const Footer = () => {
	const { t } = useTranslation();

	return (
		<StyledFooter className="text-center">
			<a href="mailto:info@meirim.org">{t.contactUs}</a> |&nbsp;
			<Link to="/terms/">{t.termsOfUse}</Link> |&nbsp;
			<Link to="/privacy-policy/">{t.privacyPolicy}</Link> |&nbsp;
			<Link to="/support-us/#who-we-are">{t.whoWeAre}</Link> |&nbsp;
			<a href="https://github.com/meirim-org/meirim/">{t.callToAction}</a>
			<br />
			<a href="https://www.facebook.com/meirim.city/">{t.ourFacebook}</a>{' '}|&nbsp;
			<a href="https://twitter.com/meirimORG">{t.ourTwitter}</a>{' '}|&nbsp;
			<a href="https://linkedin.com/company/35602639">LinkedIn</a>{' '}
			<br />
	
			Ⓒ {t.allRightsReserved} 2022 
		</StyledFooter>
	);
};

export default Footer;
