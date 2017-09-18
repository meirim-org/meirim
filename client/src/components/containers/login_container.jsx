import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import loginActions from '../../redux/actions/login_actions';
import LoginForm from '../login_form/login_form';
import {Form} from 'antd';
import 'antd/dist/antd.css';
import {Redirect} from 'react-router';

class LoginContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errorMessage: '',
			email: '',
			password: '',
		};
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(values) {
		var loginForm = {
			password: values.password || '',
			email: values.userName,
		};

		this.props.onLoginSubmit(loginForm);
	}

	render() {
		const WrappedNormalLoginForm = Form.create()(LoginForm);
		if (this.props.response == 'success') {
			return (
				<Redirect push to="/"/>);
		}
		else
			return (
				<div className='signin-container center-container'>

					<WrappedNormalLoginForm onSubmit={this.props.onLoginSubmit}
											email={this.state.email}
											password={this.state.password}
											errorMessage={this.props.response}
											onForgotPassword={this.props.onForgotPassword}
					/>
				</div>
			);
	}
}

LoginContainer.propTypes = {
	response: PropTypes.string,
};

LoginContainer.defaultProps = {
	response: '',
};

var mapDispatchToProps = function(dispatch, props) {
	return {
		onLoginSubmit: (loginForm) => {
			return dispatch(loginActions.login(loginForm));
		},
		onForgotPassword: (email) => {
			return dispatch(loginActions.forgotPassword(email));
		},
	};
};

var mapStateToProps = function(state) {
	return {
		response: state.loginReducer.response,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);