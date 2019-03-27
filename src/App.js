import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Home from './scenes/Home';
import Plans from './scenes/Plans';
import SinglePlan from './scenes/SinglePlan';
import SignIn from './scenes/SignIn';
import Activate from './scenes/Activate';
import Alerts from './scenes/Alerts';
import ForgotPassword from './scenes/ForgotPassword';
import About from './scenes/About';
import Terms from './scenes/Terms';
import api from './services/api';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'

import './assets/bootstrap.css';

library.add(faSpinner);
library.add(faTimes);

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
                    <Route exact path="/" render={(props) => <Home {...props}  me={me}/>}/>
                    <Route path="/alerts" render={(props) => <Alerts {...props} me={me}/>}/>
                    <Route path="/plans" render={(props) => <Plans {...props} me={me}/>}/>
                    <Route path="/plan/:id/" render={(props) => <SinglePlan {...props} me={me}/>}/>
                    <Route path="/sign/in" render={(props) => <SignIn {...props} me={me}/>}/>
                    <Route path="/activate" render={(props) => <Activate {...props} me={me}/>}/>
                                        <Route path="/forgot" render={(props) => <ForgotPassword {...props} me={me}/>}/>
                    <Route path="/about" render={(props) => <About {...props} me={me}/>}/>
                    <Route path="/terms" render={(props) => <Terms {...props} me={me}/>}/>
                </div>
            </Router>
        );
    }
}

export default App;
