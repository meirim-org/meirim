
import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';

import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Navigation.css';

class Navigation extends Component {
  state = {
    signOutSuccess: false
  }
  signout() {
    api.post('/sign/out')
      .then(signOutSuccess => this.setState({signOutSuccess}))
  }
  render() {
    const { me } = this.props;
    const { signOutSuccess } = this.state;

    if (signOutSuccess){
      return <Redirect to="/" />
    }
    return <nav className="navbar navbar-expand navbar-light">
      <Link className="navbar-brand" to="/">
        <img className='eyelashes_nav' src={logo} alt={t.name} /> {t.name}
      </Link>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/alerts/">{t.alerts}</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/plans/">{t.plans}</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about/">{t.about}</Link>
        </li>
      </ul>
      
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          {me && <button className="btn btn-outline-secondary" onClick={this.signout}>{t.signout}</button>}
          {!me && <Link className="btn btn-outline-secondary" to="/sign/in">{t.signin}</Link>}
        </li>
      </ul>
    </nav>
  }
}

export default Navigation;
