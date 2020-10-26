import React, { useState } from 'react';
import { NavLink as Link } from 'react-router-dom';

import api from '../../services/api';
import t from '../../locale/he_IL';
import './RegisterForm.css';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    api
      .post('/sign/up/', {
        password, email
      })
      .then(() => setDone(true))
      .catch((error) => setError(error));
  }

  React.useEffect(() => {
    if (error) {
      if (error.response) {
        if (error.response.status === 409) {
           setErrorMessage(t.emailExists);
        } else if (error.response.data && error.response.data.data) {
          setErrorMessage(error.response.data.data);
        }
      }
      if (!errorMessage) {
        setErrorMessage(t.error);
      }
    }
  },[error])

    return (
      <form className="hpForm" onSubmit={handleSubmit}>
        {(errorMessage && !done) && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {!done && (
          <div>
            <strong className="d-d-block text-center">{t.signupNow}</strong>
            <div className="form-group">
              <label htmlFor="loginName">{t.fullName}:</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                type="text"
                name="name"
                id="loginName"
                placeholder="Full Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginEmail">{t.emailAddress}:</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                type="email"
                name="email"
                id="loginEmail"
                placeholder="yourname@mail.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">{t.password}:</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                type="password"
                name="password"
                id="loginPassword"
              />
            </div>
            <div className="form-group text-center">
              <button type="submit">{t.signup}</button>
            </div>
            <div className="text-start">
              <Link to="/sign/in">
                {t.alreadyGotAccount}
              </Link>
            </div>
          </div>
        )}

        {done && (
          <div className="alert alert-success">
            שלחנו לך דואר אלקטרוני עם לינק להפעלת החשבון.
          </div>
        )}
      </form>
    );
}

export default RegisterForm;