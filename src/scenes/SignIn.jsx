import React, { Component } from "react";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

import { BrowserRouter as Router, Redirect, Link } from "react-router-dom";

import api from "../services/api";

import t from "../locale/he_IL";
import logo from "../assets/logo.png";
import "./Alerts.css";

class SignIn extends Component {
    state = {
        success: 0,
        redirectTo: ((this.props.location || {}).state || {}).redirectTo || "/"
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            success: 0
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        api.post("/sign/in", this.state)
            .then(success => this.setState({ success: 1 }))
            .catch(error => this.setState({ success: -1 }));
    }
    render() {
        const { success } = this.state;
        if (success === 1) {
            window.location = this.state.redirectTo;
        }
        return (
            <React.Fragment>
                <Navigation />
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="group">
                                <img
                                    className="eyelashes"
                                    src={logo}
                                    alt="מעירים"
                                />
                                <div
                                    className="goodMorning"
                                    id="goodMorningText"
                                >
                                    ברוכים הבאים למעירים!
                                </div>
                                <div className="selectAreaAndInterest">
                                    התחברו לחשבונכם באמצעות כתובת הדואר
                                    האלקטרוני והסיסמה שבחרתם
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rectangle dialog">
                        <form method="post" onSubmit={this.handleSubmit}>
                            {success == -1 && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    מייל או סיסמה לא נכונים
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="loginEmail">כתובת מייל:</label>
                                <Link to="/" className="float-left">
                                    הרשמה
                                </Link>
                                <input
                                    className="form-control"
                                    required
                                    onChange={this.handleChange}
                                    type="email"
                                    name="email"
                                    id="loginEmail"
                                    placeholder="yourname@mail.com"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="loginPassword">סיסמה:</label>
                                <Link to="/forgot/" className="float-left">
                                    שכחתי סיסמה
                                </Link>
                                <input
                                    className="form-control"
                                    required
                                    onChange={this.handleChange}
                                    type="password"
                                    name="password"
                                    id="loginPassword"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                            >
                                <i className="fas fa-spinner fa-spin d-none" />
                                כניסה
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default SignIn;
