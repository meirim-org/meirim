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
			<Link to="/support-us/#who-we-are">{t.whoWeAre}</Link> |&nbsp;
			<Link to="/privacy-policy/">{t.privacyPolicy}</Link> |&nbsp;
			<a href="https://docs.google.com/document/d/1z79ekk39XpI52gGXy5vW0inCqE4OA33BxwaAL7tZYGE">{t.accessibilityDeclaration}</a> |&nbsp;
			<a href="https://github.com/meirim-org/meirim/">{t.callToAction}</a>
			<br />
			<a href="https://linkedin.com/company/35602639">LinkedIn</a>{' '}|&nbsp;
			<a href="https://twitter.com/meirimORG">{t.ourTwitter}</a>{' '}|&nbsp;
			<a href="https://www.facebook.com/meirim.city/">{t.ourFacebook}</a>{' '}|&nbsp;
			<a href="https://www.instagram.com/meirim_org/">{t.ourInstagram}</a>{' '}|&nbsp;
			<a href="https://github.com/meirim-org/meirim">{t.ourGithub}</a>{' '}
			<br />
	
			Ⓒ {t.allRightsReserved} 2023 
		</StyledFooter>
	);
};

export default Footer;
