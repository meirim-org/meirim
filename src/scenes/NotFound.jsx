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
    api
      .post("/sign/in", this.state)
      .then((success) => this.setState({ success: 1 }))
      .catch((error) => this.setState({ success: -1 }));
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
                <img className="eyelashes" src={logo} alt="מעירים" />
                <div className="goodMorning" id="goodMorningText">
                  404
                  <br />
                  לא נמצא
                </div>
                <div className="selectAreaAndInterest">
                  לא מצאנו את העמוד, יכול להיות שהתוכנית נמחקה או שהקישור שבור.
                  <br />
                  בכל מקרה- אפשר לחפש תוכניות שמעניינות אתכם
                  <Link to="/plans">
                    <a> כאן </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default SignIn;
