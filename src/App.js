import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Home from './scenes/Home';
import Plans from './scenes/Plans';
import SignIn from './scenes/SignIn';
import Alerts from './scenes/Alerts';
import ForgotPassword from './scenes/ForgotPassword';
import api from './services/api';

import './assets/bootstrap.css';

class App extends Component {
    state = {
        me: null
    };
    componentWillMount() {
        api
            .get('/me')
            .then(me => this.setState({me: true}))
            .catch(error => this.setState({me: false}))
    }
    render() {
        const {me} = this.state;

        if (me === null) {
            return <div>Loading...</div>
        }

        return (
            <Router>
                <div>
                    <Route exact
                        path="/"
                        render={(props) => me
                        ? <Alerts {...props} me={me}/>
                        : <Home {...props}/>}/>
                    <Route path="/plans" render={(props) => <Plans {...props} me={me}/>}/>
                    <Route path="/sign/in" render={(props) => <SignIn {...props} me={me}/>}/>
                    <Route path="/forgot" render={(props) => <ForgotPassword {...props} me={me}/>}/>
                </div>
            </Router>
        );
    }
}

export default App;
