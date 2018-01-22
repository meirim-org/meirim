import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ResetPasswordContainer from '../containers/reset_password_container';
import HomePage from '../home_page/home_page';

class AppLayout extends Component {
	render() {

		return (
			<div>
				<main>
					<Route path='/' exact component={HomePage} />
					<Route path='/password/reset' component={ResetPasswordContainer} />
				</main>
			</div>
		);
	}
}

export default AppLayout;
