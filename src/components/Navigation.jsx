
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import t from '../locale/he_IL';
import logo from './logo.png';
import './Navigation.css';

class Navigation extends Component {
  render() {
      return <nav className="navbar navbar-expand navbar-light">
      <Link className="navbar-brand" to="/">
        <img className='eyelashes' src={logo} alt={t.name} /> {t.name}
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
          <Link className="btn btn-outline-secondary" to="/login">{t.signin}</Link>
        </li>
      </ul>
    </nav>
  }
}

export default Navigation;
