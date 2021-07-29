import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    padding: 2rem 1rem;
    line-height: 1.8;
`;

const Footer = () => {
	const { t } = useTranslation();

	return (
		<StyledFooter className="text-center">
			<a href="mailto:info@meirim.org">{t.contactUs}</a> |&nbsp;
			<a href="https://www.facebook.com/meirim.city/">{t.ourFacebook}</a>{' '}
        |&nbsp;
			<Link to="/support-us/#who-we-are">{t.whoWeAre}</Link> |&nbsp;
			<a href="https://github.com/meirim-org/meirim/">{t.callToAction}</a>
			<br />
			<Link to="/terms/">{t.termsOfUse}</Link> |&nbsp;
			<Link to="/privacy-policy/">{t.privacyPolicy}</Link> |&nbsp;
			{t.allRightsReserved}
		</StyledFooter>
	);
};

export default Footer;
