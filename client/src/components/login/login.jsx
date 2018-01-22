import React from 'react';

const Login = (props) => {
  return (
    <div className="login">
			<span className="pre">
        <p><b>בוקר טוב!</b></p>
        <p>הכניסו פרטים אישיים כדי להיכנס לחשבון</p>
			</span>
      <div className="group email">
        <input value={props.email} name="email" type="text" onChange={props.onChange} required
               placeholder='כתובת מייל:'/>
      </div>

      <div className="group password">
        <input type="password" name="password" value={props.password} onChange={props.onChange} required
               placeholder='סיסמא:'/>
      </div>

      <div className='submit-wrapper'>
        <input type='button' value='>' className='submit' onClick={props.onSubmit}/>
      </div>
    </div>
  );
};

export default Login;
