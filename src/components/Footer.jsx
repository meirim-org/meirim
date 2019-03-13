
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import t from '../locale/he_IL';

class Footer extends Component {
  render() {
      return <footer className="text-center">
        
      <a href="mailto:info@meirim.org">יצירת קשר</a> | <a href="https://www.facebook.com/meirim.city/">הפייסבוק שלנו</a> |
      <Link to="/about/">{t.about}</Link> | 
      <a href="https://github.com/meirim-org/meirim/">הצטרפו לצוות</a><br />
      <Link to="/terms/">תנאי שימוש</Link> |  כל הזכויות שמורות
    </footer>
    
  }
}

export default Footer;
