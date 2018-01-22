import React from 'react';

require('./footer.scss');

const Footer = () => {
  return (
    <div className={"footer"}>
      <p className={"conatct-us"}>מוזמנים לכתוב לנו בכל עניין
        <br/>
        <a href={"mailto:info@mairim.com"}>info@meirim.com</a>
      </p>
      <p className={"copyrights"}>
        © #{(new Date()).getFullYear()}   כל הזכויות שמורות למעירים
      </p>
    </div>
  )
};

export default Footer;
