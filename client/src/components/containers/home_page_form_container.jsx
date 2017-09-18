import React, {Component} from 'react';
import {connect} from 'react-redux';
import loginActions from '../../redux/actions/login_actions';
import HomePageForm from '../home_page_form/home_page_form';
import {Redirect} from 'react-router';

class HomepageFormContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			agree: false,
			terms: false,
		};
		this.onSignupSubmit = this.onSignupSubmit.bind(this);
		this.onLoginSubmit = this.onLoginSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	onSignupSubmit() {
		if (!this.state.email) {
			alert('הכנס מייל');
			return;
		}
		if (!this.state.password) {
			alert('הכנס סיסמא');
			return;
		}
		if (!this.state.agree) {
			alert('תסכים לתוכן שיווקי');
			return;
		}
		if (!this.state.terms) {
			alert('תסכים לתנאי שימוש');
			return;
		}
		this.props.onSignupSubmit({
			email: this.state.email,
			password: this.state.password,
		});
	}

	onLoginSubmit() {
		if (!this.state.email) {
			alert('הכנס מייל');
			return;
		}
		if (!this.state.password) {
			alert('הכנס סיסמא');
			return;
		}
		this.props.onLoginSubmit({
			email: this.state.email,
			password: this.state.password,
		});
	}

	onChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	toggle(event) {
		this.setState({[event.target.name]: !this.state[event.target.name]});
	}

	render() {
		return (
			<div className='signin-container center-container'>
				<HomePageForm
					onSignupSubmit={this.onSignupSubmit}
					onLoginSubmit={this.onLoginSubmit}
					email={this.state.email}
					password={this.state.password}
					onChange={this.onChange}
					toggle={this.toggle}
					agree={this.state.agree}
					terms={this.state.terms}
					status={this.props.status}
				/>
			</div>
		);
	}
}

var mapDispatchToProps = function(dispatch, props) {
	return {
		onLoginSubmit: (loginForm) => {
			return dispatch(loginActions.login(loginForm));
		},
		onSignupSubmit: (submitForm) => {
			return dispatch(loginActions.signup(submitForm));
		},
		onForgotPassword: (email) => {
			return dispatch(loginActions.forgotPassword(email));
		},
	};
};

var mapStateToProps = function(state) {
	return {
		status: state.loginReducer.status,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomepageFormContainer);