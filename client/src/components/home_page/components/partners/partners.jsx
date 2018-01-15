import React from 'react';

require('./partners.scss');

const Partners = () => {
  return (
    <div className={"partners"}>
      <p className={"title"}>השותפים שלנו</p>
      <div className={"partners-list"}>
        <img src={require('../../../../images/logo-shorashim.png')}/>
        <img src={require('../../../../images/logo-hatnua.png')}/>
        <img src={require('../../../../images/logo-hevra.png')}/>
        <img src={require('../../../../images/logo-lebinui.png')}/>
        <img src={require('../../../../images/logo-mithabrim.png')}/>
        <img src={require('../../../../images/logo-sadna.png')}/>
        <img src={require('../../../../images/logo-sviva.png')}/>
      </div>
    </div>
  )
};

export default Partners;
