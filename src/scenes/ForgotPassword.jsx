import React, { Component } from 'react';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Alerts.css';

class ForgotPassword extends Component {
  state = {
    error: false,
    stage: 'email',
  };
  constructor(props) {
    super(props);

    this.changePassword = this.changePassword.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: false,
    });
  }

  sendEmail(event) {
    event.preventDefault();
    const { email } = this.state;
    this.setState({ stage: 'sending' });
    api
      .post('/password/sendResetToken', { email })
      .then((success) => this.setState({ stage: 'sent' }))
      .catch((error) => this.setState({ error, stage: 'email' }));
  }
  componentDidMount() {
    const { token } = queryString.parse(this.props.location.search);
    if (token) {
      this.setState({ token, stage: 'change' });
    }
  }

  changePassword(event) {
    event.preventDefault();
    const { password, token } = this.state;
    this.setState({ stage: 'changing' });
    api
      .post('/password/resetWithToken', { password, token })
      .then(() => this.setState({ stage: 'changed' }))
      .catch((error) => this.setState({ error, stage: 'change' }));
  }
  render() {
    const { stage, error } = this.state;

    if (stage === 'changed') {
      return <Redirect to="/sign/in/" />;
    }
    return (
      <React.Fragment>
        <Navigation />
        <div className="container dialog">
          <div className="row">
            <div className="col">
              <div className="group">
                <img className="eyelashes" src={logo} alt="מעירים" />
                <div className="goodMorning" id="goodMorningText">
                  {t.forgotPassword}
                </div>
                <div className="selectAreaAndInterest">
                  הכניסו את כתובת הדואר האלקטרוני שבאמצעותה נרשמתם ונשלח לכם קוד
                  לאיפוס הסיסמה.
                </div>
              </div>
            </div>
          </div>

          {(() => {
            switch (stage) {
              case 'email':
                return (
                  <div className="rectangle">
                    <form id="stage1" method="post" onSubmit={this.sendEmail}>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          כתובת המייל אינה תקינה
                        </div>
                      )}
                      <div className="form-group">
                        <label for="loginEmail">
                          שלב 1 - כתובת דואר אלקטרוני:
                        </label>
                        <input
                          className="form-control"
                          required
                          type="email"
                          name="email"
                          id="loginEmail"
                          onChange={this.handleChange}
                          placeholder="yourname@mail.com"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        <i className="fas fa-spinner fa-spin d-none" />
                        שליחת קוד איפוס
                      </button>
                    </form>
                  </div>
                );
              case 'sent':
                return (
                  <div className="alert alert-success" role="alert">
                    שלחנו לך דואר אלקטרוני עם הנחיות להמשך
                  </div>
                );
              case 'change':
                return (
                  <div className="rectangle" id="container">
                    <form
                      id="stage2"
                      method="post"
                      style={{
                        marginTop: '20px',
                      }}
                      onSubmit={this.changePassword}
                    >
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          חלה שגיאה
                        </div>
                      )}

                      <div className="form-group">
                        <label for="emailCode">שלב 2 -החלפת סיסמה:</label>
                        <input
                          className="form-control"
                          type="hidden"
                          name="emailCode"
                          id="emailCode"
                        />
                      </div>
                      <div className="form-group">
                        <label for="loginPassword">נא לבחור סיסמה חדשה:</label>
                        <input
                          className="form-control"
                          minLength={6}
                          required
                          type="password"
                          onChange={this.handleChange}
                          name="password"
                          id="loginPassword"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        <i className="fas fa-spinner fa-spin d-none" />
                        החלפה
                      </button>
                    </form>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default ForgotPassword;
