
import React, {Component} 						from 'react';
import PropTypes 								from 'prop-types';
import { Form, Icon, Input, Button, Card }            from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends Component {

    constructor(props){
        super(props);
		this.handleForgotPassword = this.handleForgotPassword.bind(this);
		// this.handleNewPasswordSubmit = this.handleNewPasswordSubmit.bind(this);

		this.state = {
			inForgotPasswordMode: false
		};
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }
	handleEmailSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, value) => {
			if (!err) {
				this.props.onForgotPassword(value);
			}
		});
	}
    handleForgotPassword() {
		this.setState({inForgotPasswordMode: true});
	}
	handleNewPasswordSubmit= (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, value) => {
			if (!err) {
				this.setState({inForgotPasswordMode: false});
			}
		});
	}
    render() {
        const { getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        this.userNameError = isFieldTouched('userName') && getFieldError('userName');
        this.passwordError = isFieldTouched('password') && getFieldError('password');
        this.loginError = this.props.errorMessage === "" ? "" : <div className="ant-alert-error">
            {this.props.errorMessage}
        </div>;
        if (this.state.inForgotPasswordMode) {
			return this.renderForgotPassword();
		}
		if (this.props.inCreatNewPassword) {
			return this.renderCreateNewPassword();
		}
		return this.renderLogin();
    }

    renderLogin() {
		return (
			<Card title="כניסה לחשבון" style={{ width: 300 }}>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<FormItem
						validateStatus={this.userNameError ? 'error' : ''}
						help={this.userNameError || ''}
						label="שם משתמש"
					>
						{this.props.form.getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your username!' }],
						})(
							<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
						)}
					</FormItem>
					<FormItem
						validateStatus={this.passwordError ? 'error' : ''}
						help={this.passwordError || ''}
						label="סיסמא"
					>
						{this.props.form.getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
						)}
					</FormItem>
					<FormItem>
						<Button
							type="primary"
							htmlType="submit"
							disabled={hasErrors(this.props.form.getFieldsError())}
						>
							Log in
						</Button>
					</FormItem>
					<FormItem>
						<div onClick={this.handleForgotPassword}>Forgot password</div>
					</FormItem>
					{this.loginError}
				</Form>
			</Card>
		);
	}

	renderForgotPassword() {
    	return(
			<Card title="איפוס סיסמא" style={{ width: 300 }}>
				<Form layout="inline" onSubmit={this.handleEmailSubmit}>
					<FormItem
						validateStatus={this.userNameError ? 'error' : ''}
						help={this.userNameError || ''}
						label="אימייל"
					>
						{this.props.form.getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your email!' }],
						})(
							<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
						)}
					</FormItem>
					<FormItem>
						<Button
							type="primary"
							htmlType="submit"
							disabled={hasErrors(this.props.form.getFieldsError())}
						>
							Reset
						</Button>
					</FormItem>
					{this.loginError}
				</Form>
			</Card>
		);
	}

	renderCreateNewPassword() {
		return(
			<Card title="בחירת סיסמא חדשה" style={{ width: 300 }}>
				<Form layout="inline" onSubmit={this.handleNewPasswordSubmit}>
					<FormItem
						validateStatus={this.passwordError ? 'error' : ''}
						help={this.passwordError || ''}
						label="סיסמא"
					>
						{this.props.form.getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input a new Password' }],
						})(
							<Input prefix={<Icon type="password" style={{ fontSize: 13 }} />} placeholder="Password" />
						)}
					</FormItem>
					<FormItem>
						<Button
							type="primary"
							htmlType="submit"
							disabled={hasErrors(this.props.form.getFieldsError())}
						>
							Reset
						</Button>
					</FormItem>
					{this.loginError}
				</Form>
			</Card>
		);
	}
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func,
    errorMessage: PropTypes.string,
	onForgotPassword: PropTypes.func,
	onCreateNewPasswordPassword: PropTypes.func
};

LoginForm.defaultProps = {
    onSubmit: () =>{},
    errorMessage: "",
};

export default LoginForm;