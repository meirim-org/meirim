import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import LoginContainer from '../Containers/LoginContainer';
import ResetPasswordContainer from '../Containers/ResetPasswordContainer';
import Header from '../Header/Header';
import HomePage from '../HomePage/HomePage';

const { Content, Footer } = Layout;

class AppLayout extends Component {
	render() {

		return (
			<div>
				<Router>
					<Layout>
						<Header />
						<Content style={{ padding: '0 50px', marginTop: 64 }}>
							<div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
								<Route path='/' exact component={HomePage} />
								<Route path='/login' component={LoginContainer} />
								<Route path='/password/reset' component={ResetPasswordContainer} />
							</div>
						</Content>
					</Layout>
				</Router>
			</div>
		);
	}
}

export default AppLayout;
