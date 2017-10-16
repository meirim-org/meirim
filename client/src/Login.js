import React, { Component } from 'react';
import './Login.css';
import {Provider}               from 'react-redux';
import configureStore          	from './redux/store/configureStore';
import LoginContainer           from './components/LoginContainer/LoginContainer';

const store = configureStore();

class Login extends Component {
    render() {
        return (
            <Provider store={store}>
                <LoginContainer />
            </Provider>
        );
    }
}

export default Login;