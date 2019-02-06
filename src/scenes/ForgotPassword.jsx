import React, {Component} from 'react';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import {BrowserRouter as Router, Redirect, Link} from 'react-router-dom';

import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Alerts.css';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: 0
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

    handleSubmit(event) {
        event.preventDefault();
        api
            .post('/password/sendResetToken', this.state)
            .then(success => this.setState({success: 1}))
            .catch(error => this.setState({success: -1}));

    }
    render() {
        const {success} = this.state;
        if (success === 1) {
            return <Redirect to='/alerts'/>
        }
        return <React.Fragment>
            <Navigation/>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="group">
                            <img class='eyelashes' src="/images/logo.png" alt="מעירים"/>
                            <div class="goodMorning" id="goodMorningText">
                                שכחתם את הסיסמה?
                            </div>
                            <div class="selectAreaAndInterest">
                                הכניסו את כתובת הדואר האלקטרוני שבאמצעותה נרשמתם ונשלח לכם קוד לאיפוס הסיסמה.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rectangle" id="container">
                    <form id="stage1" method="post" onSubmit={this.handleSubmit}>
                        {success == -1 && <div class="alert alert-danger" role="alert">כתובת המייל אינה תקינה</div>}
                        <div class="form-group">
                            <label for="loginEmail">שלב 1 - כתובת דואר אלקטרוני:</label>
                            <input
                                class="form-control"
                                required
                                type="email"
                                name="email"
                                id="loginEmail"
                                placeholder="yourname@mail.com"/>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-spinner fa-spin d-none"></i>
                            שליחת קוד איפוס</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </React.Fragment>
    }
}

export default ForgotPassword;
