import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    padding: 2rem 1rem;
    line-height: 1.8;
`;

const Footer = () => {
	const { translate } = useTranslation();

	return (
		<StyledFooter className="text-center">
			<a href="mailto:info@meirim.org">{translate.contactUs}</a> |&nbsp;
			<a href="https://www.facebook.com/meirim.city/">{translate.ourFacebook}</a>{' '}
        |&nbsp;
			<Link to="/support-us/#who-we-are">{translate.whoWeAre}</Link> |&nbsp;
			<a href="https://github.com/meirim-org/meirim/">{translate.callToAction}</a>
			<br />
			<Link to="/terms/">{translate.termsOfUse}</Link> |&nbsp;
			<Link to="/privacy-policy/">{translate.privacyPolicy}</Link> |&nbsp;
			{translate.allRightsReserved}
		</StyledFooter>
	);
};

export default Footer;
