
import React, {Component} 						from 'react';
import PropTypes 								from 'prop-types';
import { Form, Icon, Input, Button, Card }      from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ResetPasswordForm extends Component {

	constructor(props){
		super(props);
		this.handleNewPasswordSubmit = this.handleNewPasswordSubmit.bind(this);

		this.state = {
			inForgotPasswordMode: false
		};
	}

	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}
	handleNewPasswordSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, value) => {
			if (!err) {
				this.props.onSubmit(value.password);
			}
		});
	}
	render() {
		const { getFieldError, isFieldTouched } = this.props.form;

		// Only show error after a field is touched.
		this.passwordError = isFieldTouched('password') && getFieldError('password');
		this.loginError = this.props.errorMessage == "" ? "" : <div className="ant-alert-error">
			{this.props.errorMessage}
		</div>;
		return this.renderCreateNewPassword();
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

ResetPasswordForm.propTypes = {
	errorMessage: PropTypes.string,
	onSubmit: PropTypes.func
};

ResetPasswordForm.defaultProps = {
	errorMessage: "",
};

export default ResetPasswordForm;