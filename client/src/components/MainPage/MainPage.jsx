import React, { Component } from 'react';
import {Provider}               from 'react-redux';
import configureStore          	from '../../redux/store/configureStore';
import AppLayout                from '../AppLayout/AppLayout';

const store = configureStore();

class Login extends Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <AppLayout/>
                </Provider>
            </div>
        );
    }
}

export default Login;