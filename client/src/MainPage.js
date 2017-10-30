import React, { Component } from 'react';
import {Provider}               from 'react-redux';
import configureStore          	from './redux/store/configureStore';
import LoginContainer           from './components/LoginContainer/LoginContainer';
import AppLayout                from './components/AppLayout/AppLayout';

const store = configureStore();

class Login extends Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <AppLayout/>
                    {/*<LoginContainer />*/}
                </Provider>
            </div>
        );
    }
}

export default Login;