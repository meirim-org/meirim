import React, { Component } from "react";
import api from "../services/api";
import t from "../locale/he_IL";
import "./RegisterForm.css";

class RegisterForm extends Component {
  state = {
    error: false,
    done: false
  };
  
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    event.preventDefault();
  }

  handleSubmit(event) {
    event.preventDefault();
    api
      .post("/sign/up/", this.state)
      .then((res) => this.setState({ done: true }))
      .catch((error) => this.setState({ error }));
  }

  render() {
    const { done, error } = this.state;
    let errorMessage = "";
    if (error) {
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = t.emailExists;
        } else if (error.response.data && error.response.data.data) {
          errorMessage = error.response.data;
        }
      }
      if (!errorMessage) {
        errorMessage = t.error;
      }
    }

    return (
      <form className="hpForm" onSubmit={this.handleSubmit}>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {!done && (
          <div>
            <strong className="d-d-block text-center">{t.signupNow}:</strong>
            <div className="form-group">
              <label for="loginEmail">{t.emailAddress}:</label>
              <input
                onChange={this.handleChange}
                value={this.state.email}
                required
                type="email"
                name="email"
                id="loginEmail"
                placeholder="yourname@mail.com"
              />
            </div>
            <div className="form-group">
              <label for="loginPassword">{t.password}</label>
              <input
                onChange={this.handleChange}
                value={this.state.password}
                required
                type="password"
                name="password"
                id="loginPassword"
              />
            </div>
            <div className="form-group text-center">
              <button type="submit">{t.signup}</button>
            </div>
          </div>
        )}

        {done && (
          <div className="alert alert-success">
            שלחו לך דואר אלקטרוני עם לינק להפעלת החשבון.
          </div>
        )}
      </form>
    );
  }
}

export default RegisterForm;
