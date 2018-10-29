import React from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";


import t from './i18n/he';
import Home from './components/home';
import Login from './components/login';
import Alerts from './components/alerts';

import logo from './assets/logo.png';

const App = () => (
  <Router>
    <div>
    <div className="">
      <nav className="navbar navbar-expand-lg">
        <Link to="/" className="nav-brand">
          <img className="eyelashes d-inline-block align-top" style={{width:30}} src={logo} alt={t.brand} /> 
          {t.brand}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link to="/" className="nav-link">{t.home}</Link>
            </li>
            <li className="nav-item">
              <Link to="/alerts" className="nav-link">{t.alerts}</Link>
            </li>
          </ul>
          
        </div>  
        <Link to="/login" className="btn btn-outline-primary float-left">{t.login}</Link>  
      </nav>
    </div>
    <div className="container">
      <Route exact path="/" component={Home}/>
    <Route path="/alerts" component={Alerts}/>
    <Route path="/login" component={Login}/>
    </div>
    </div>
   

    
  </Router>
);

export default App;
