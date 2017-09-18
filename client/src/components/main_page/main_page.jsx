import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../redux/store/configure_store';
import AppLayout from '../app_layout/app_layout';
import { BrowserRouter as Router } from 'react-router-dom';

const store = configureStore();

class Login extends Component {
	render() {
		return (
			<div>
				<Provider store={store}>
					<Router>
						<AppLayout />
					</Router>
				</Provider>
			</div>
		);
	}
}

export default Login;