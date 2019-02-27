import React, {Component} from 'react';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import queryString from 'query-string'
import {BrowserRouter as Router, Redirect, Link} from 'react-router-dom';

import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Alerts.css';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0
        };

        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            success: 0
        });
    }

    sendEmail(event) {
        event.preventDefault();
        const {email} = this.state;
        api
            .post('/password/sendResetToken', {email})
            .then(success => this.setState({stage: 1}))
            .catch(error => this.setState({stage: -1}));

    }

    changePassword(event) {
      event.preventDefault();
      const {password }= this.state;
      const {token} = queryString.parse(this.props.location.search);
      api
          .post('/password/resetWithToken', {password , token})
          .then(success => this.setState({stage: 2}))
          .catch(error => this.setState({stage: -1}));

    }
    render() {
        const { stage } = this.state;
        const {token} = queryString.parse(this.props.location.search);
        if (stage === 3) {
            return <Redirect to='/sign/in/'/>
        }
        return <React.Fragment>
            <Navigation/>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="group">
                            <img class='eyelashes' src={logo} alt="מעירים"/>
                            <div class="goodMorning" id="goodMorningText">
                                שכחתם את הסיסמה?
                            </div>
                            <div class="selectAreaAndInterest">
                                הכניסו את כתובת הדואר האלקטרוני שבאמצעותה נרשמתם ונשלח לכם קוד לאיפוס הסיסמה.
                            </div>
                        </div>
                    </div>
                </div>

                {!token && <div class="rectangle" id="container">
                    <form id="stage1" method="post" onSubmit={this.sendEmail}>
                        {stage == -1 && <div class="alert alert-danger" role="alert">כתובת המייל אינה תקינה</div>}
                        <div class="form-group">
                            <label for="loginEmail">שלב 1 - כתובת דואר אלקטרוני:</label>
                            <input
                                class="form-control"
                                required
                                type="email"
                                name="email"
                                id="loginEmail"
                                onChange = {this.handleChange}
                                placeholder="yourname@mail.com"/>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-spinner fa-spin d-none"></i>
                            שליחת קוד איפוס</button>
                    </form>
                </div>
                }

            {token && <div class="rectangle" id="container">
                <form id="stage2" method="post" style={{marginTop:"20px"}}  onSubmit={this.changePassword}>
                    <div class="form-group">
                        <label for="emailCode">שלב 2 -החלפת סיסמה:</label>
                        <input class="form-control" type="hidden" name="emailCode" id="emailCode" />
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">סיסמה חדשה:</label>
                        <input class="form-control" 
                          minLength={6} 
                          required 
                          type="password" 
                          onChange = {this.handleChange} 
                          name="password" 
                          id="loginPassword" />
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-spinner fa-spin d-none"></i> החלפה</button>
                </form>
            </div>
                }
            </div>
            <Footer/>
        </React.Fragment>
    }
}

export default ForgotPassword;
