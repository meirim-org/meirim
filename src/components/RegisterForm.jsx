
import React, { Component } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import api from '../services/api';
import t from '../locale/he_IL';
import './RegisterForm.css';

class RegisterForm extends Component {

  constructor(props) {
    super(props);
    this.state = {email: '',
      password:''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    event.preventDefault();
  }

  handleSubmit(event) {
    event.preventDefault();
    api.post('/sign/up/',this.state)
    .then(res => this.setState({done:true}))
  }

  render() {
    if (this.state.done) {
      return <Redirect to='/dashboard' />
    }
      return <form className="hpForm" onSubmit={this.handleSubmit}>
        <strong className="d-d-block text-center">{t.signup_now}:</strong>
        <div className="form-group">
          <label for="loginEmail">{t.email_address}:</label>
          <input onChange={this.handleChange} value={this.state.email} required type="email" name="email" id="loginEmail" placeholder="yourname@mail.com" />
        </div>
        <div className="form-group">
          <label for="loginPassword">{t.password}</label>
          <input onChange={this.handleChange} value={this.state.password} required type="password" name="password" id="loginPassword" />
        </div>
        <div className="form-group text-center">
          <button type="submit">{t.signup}</button>
        </div>
      </form>
  }
}
export default RegisterForm;
