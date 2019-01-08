import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './scenes/Home';
import Plans from './scenes/Plans';
import Sign from './scenes/Sign';
import Alerts from './scenes/Alerts';

class App extends Component {
  render() {
    return (
      <Router>
      <div> 
        <Route exact path="/" component={Home} />
        <Route path="/plans" component={Plans} />
        <Route path="/sign" component={Sign} />
        <Route path="/alerts" component={Alerts} />
      </div>
    </Router>
    );
  }
}

export default App;
