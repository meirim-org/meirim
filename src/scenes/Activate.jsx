import React, { Component } from "react";
import queryString from "query-string";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

import api from "../services/api";

import t from "../locale/he_IL";
import logo from "../assets/logo.png";
import "./Alerts.css";

class Activate extends Component {
  state = {
    step: 0,
    error: 0
  };

  componentDidMount() {
    const { token } = queryString.parse(this.props.location.search);

    if (!token) {
      return this.setState({ step: -1, error: "No token" });
    }
    api
      .post("/sign/activate", { token })
      .then((success) => this.setState({ step: 1 }))
      .catch((error) => this.setState({ step: -1, error: "We got an error" }));
  }
  render() {
    const { step, error } = this.state;

    return (
      <React.Fragment>
        <Navigation />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="group">
                <img className="eyelashes" src={logo} alt="מעירים" />
                <div className="goodMorning" id="goodMorningText">
                  ברוכים הבאים למעירים!
                </div>
                <div className="selectAreaAndInterest">
                  {step === 0 && `מנסים להפעיל את החשבון שלך`}
                  {step === 1 && `החשבון הופעל בהצלחה`}
                  {step === -1 && (
                    <div className="alert alert-danger">{error}</div>
                  )}
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

export default Activate;
