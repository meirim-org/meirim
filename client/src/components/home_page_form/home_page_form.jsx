import React, { Component } from 'react';
import Join from '../join/join';
import Login from '../login/login';
import { Redirect } from 'react-router';


require('./home_page_form.scss');


export default class HomePageForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentTab: 'join',
		};

		this.setTab = this.setTab.bind(this);
	}

	setTab(currentTab) {
		this.setState({ currentTab })
	}

	render() {
		console.log(this.props);
		if (this.props.status === 'logged') {
			return <Redirect push to="/alert.html" />;
		}
		if (this.props.status === 'registered') {
			return (
				<div className='home-page-form'>
					<div className='registered'>
						<p className='title'>כמעט סיימנו!</p>
						<p className='message'>לפני שנוכל לשלוח לכם התרעות אנא אשרו את ההרשמה במייל שנשלח אליכם.</p>
						<div className='thanks'>
							<strong>תודה!</strong>
							<p>צוות מעירים</p>
						</div>
					</div>
				</div>
			)
		}
		return (
			<div className='home-page-form'>
				<ul className='tabs'>
					<li onClick={() => { this.setTab('join') }} className={this.state.currentTab === 'join' ? 'selected' : ''}>הרשמה</li>
					<li onClick={() => { this.setTab('login') }} className={this.state.currentTab === 'login' ? 'selected' : ''}>התחברות</li>
				</ul>
				<div className='wrapper'>
					{this.state.currentTab === 'join' ?
						<Join
							password={this.props.password}
							email={this.props.email}
							onChange={this.props.onChange}
							onSubmit={this.props.onSignupSubmit}
							toggle={this.props.toggle}
							terms={this.props.terms}
							agree={this.props.agree}
						/> :
						<Login
							password={this.props.password}
							email={this.props.email}
							onChange={this.props.onChange}
							onSubmit={this.props.onLoginSubmit}
						/>
					}
				</div>
			</div>
		)
	}
}