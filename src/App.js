import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './scenes/Home';
import Plans from './scenes/Plans';
import SignIn from './scenes/SignIn';
import Alerts from './scenes/Alerts';

import api from './services/api';

import './assets/bootstrap.css';

class App extends Component {
  state = {
    me: null
  };
  componentWillMount() {
    api.get('/me')
    .then(me=>this.setState({me}))
    .catch(error => this.setState({me:false}))
  }
  render() {
    const { me } = this.state;

    if (me === null){
      return <div>Loading...</div>
    }

    return (
      <Router>
      <div> 
        <Route exact path="/" component={me ? Alerts : Home} me={me} />
        <Route path="/plans" component={Plans} me={me} />
        <Route path="/sign/in" component={SignIn} me={me} />
      </div>
    </Router>
    );
  }
}

export default App;
