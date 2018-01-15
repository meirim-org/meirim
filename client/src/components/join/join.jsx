import React from 'react';

const Join = (props) => {
  return (
    <div className="join">
			<span className="title">
				רוצים לדעת מה קורה ליד הבית שלכם?
        <b>	הרשמו למערכת ההתרעות שלנו</b>
			</span>
      <div className={"column signup-details"}>
        <div className="group email">
          <input value={props.email} name="email" type="text" onChange={props.onChange} required
                 placeholder='כתובת מייל:'/>
        </div>
        <div className="group password">
          <input type="password" name="password" value={props.password} onChange={props.onChange} required
                 placeholder='סיסמא:'/>
        </div>
      </div>
      <div className={"terms-wrapper"}>
        <div className="read-terms">
          <input type="checkbox" name="terms" onChange={props.toggle} checked={props.terms} className="terms-of-use"
                 value="Terms"/>
          <span>קראתי את </span>
          <a href="/terms"><strong>תנאי השימוש</strong></a>
        </div>
        <div className="read-terms">
          <input type="checkbox" name="agree" onChange={props.toggle} checked={props.agree} className="terms-of-use"
                 value="Terms"/>
          <span>הנני מסכים/מה לקבלת מידע שיווקי</span>
        </div>
      </div>
      <div className='submit-wrapper'>
        <input type='button' value='>' className='submit' onClick={props.onSubmit}/>
      </div>
    </div>
  )
};

export default Join;
