import React from 'react';

require('./footer.scss');

const Footer = () => {
  return (
    <div className={"footer"}>
      <div className={"conatct-us"}>
        <div className='mail'>
          <p>מוזמנים לכתוב לנו בכל עניין</p>
          <a href={"mailto:info@mairim.com"}>info@meirim.com</a>
        </div>
        <a href='https://www.facebook.com/meirim.city/' target='_blank'>
          <img src={require('../../../../images/logo-fb.png')} />
        </a>
      </div>
      <p className={"copyrights"}>
        © #{(new Date()).getFullYear()}   כל הזכויות שמורות למעירים
      </p>
    </div>
  )
};

export default Footer;
