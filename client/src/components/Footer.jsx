import React from 'react';
import { Link } from 'react-router-dom';
import t from 'locale/he_IL';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    padding: 2rem 1rem;
    line-height: 1.8;
`;

const Footer = () => {
	return (
		<StyledFooter className="text-center">
			<a href="mailto:info@meirim.org">יצירת קשר</a> |&nbsp;
			<a href="https://www.facebook.com/meirim.city/">הפייסבוק שלנו</a>{' '}
        |&nbsp;
			<Link to="/funding/#who-we-are">{t.whoWeAre}</Link> |&nbsp;
			<a href="https://github.com/meirim-org/meirim/">הצטרפו לצוות</a>
			<br />
			<Link to="/terms/">תנאי שימוש</Link> |&nbsp;
			<Link to="/privacy-policy/">מדיניות פרטיות</Link> |&nbsp;
			כל הזכויות שמורות
		</StyledFooter>
	);
};

export default Footer;
