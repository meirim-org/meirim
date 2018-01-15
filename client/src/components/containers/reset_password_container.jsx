import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import loginActions from '../../redux/actions/login_actions';
import ResetPasswordForm from '../login_form/login_form';
import {Form} from 'antd';
import 'antd/dist/antd.css';

class ResetPasswordContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errorMessage: '',
			password: '',
		};
	}

	render() {
		const WrappedNormalResetPasswordForm = Form.create()(ResetPasswordForm);

		return (
			<div className='signin-container center-container'>

				<WrappedNormalResetPasswordForm onSubmit={this.props.onCreateNewPassword}
												password={this.state.password}
												errorMessage={this.props.response}
				/>
			</div>
		);
	}
}

ResetPasswordContainer.propTypes = {
	response: PropTypes.string,
};

ResetPasswordContainer.defaultProps = {
	response: '',
};

var mapDispatchToProps = function(dispatch, props) {
	const resetPasswordToken = props.location.search && props.location.search.match(/\?token=(.*)/)[1];
	return {
		onCreateNewPassword: (password) => {
			return dispatch(loginActions.createNewPassword({password, token: resetPasswordToken}));
		},
	};
};

var mapStateToProps = function(state) {
	return {
		response: state.loginReducer.response,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordContainer);