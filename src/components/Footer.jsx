import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import t from '../locale/he_IL';

class Footer extends Component {
  render() {
    return (
      <footer className="text-center">
        <a href="mailto:info@meirim.org">יצירת קשר</a> |&nbsp;
        <a href="https://www.facebook.com/meirim.city/">הפייסבוק שלנו</a>{' '}
        |&nbsp;
        <Link to="/about/">{t.about}</Link> |&nbsp;
        <a href="https://github.com/meirim-org/meirim/">הצטרפו לצוות</a>
        <br />
        <Link to="/terms/">תנאי שימוש</Link> | כל הזכויות שמורות
      </footer>
    );
  }
}

export default Footer;
