import React, { Component } from 'react';
import { NavLink as Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Navigation.css';

class Navigation extends Component {
  state = {
    signOutSuccess: false,
  };
  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }
  signout() {
    api.post('/sign/out').then((signOutSuccess) => {
      window.location = '/';
    });
  }
  render() {
    const { me } = this.props;

    return (
      <nav className="navbar navbar-expand navbar-light">
        <Link className="navbar-brand" to={me ? '/plans' : '/'}>
          <img className="eyelashes_nav" src={logo} alt={t.name} />{' '}
          <Hidden mdDown={true}>{t.name}</Hidden>
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/alerts/">
              {t.alerts}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/plans/">
              {t.plans}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/vocabulary/">
              {t.vocabulary}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/funding/">
              {t.funding}
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            {me && (
              <button
                className="btn btn-outline-secondary"
                onClick={this.signout}
              >
                {t.signout}
              </button>
            )}
            {!me && (
              <Link className="btn btn-outline-secondary" to="/sign/in">
                {t.signin}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navigation;
