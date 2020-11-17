import React, {useState} from 'react';
import {Redirect} from 'react-router-dom'
import {authenticateEmail} from './handlers';
import {Button, Link, Modal, TextInput} from '../../shared';

import * as SC from './style';

const Login = () => {
	const [loginSuccess, setLoginSucess] = useState(false);
	const [loginValues, setLoginValues] = useState({email: '', password: ''});
	const [onFocusInput, setOnFocusInput] = useState({ email: false, password: false })
	const [dirtyInputs, setDirtyInputs] = useState({email: false, password: false})
	const [formErrors, setFormErrors] = useState({
		emailError: {isValid: true, message: ''},
		passwordError: {isValid: true, message: ''}
	})

	const onInputFocus = (inputName) => {
		const newState = {}
		newState[inputName] = true
		setDirtyInputs({...dirtyInputs, ...newState})
		setOnFocusInput({...onFocusInput, ...newState})
	}

	const onInputBlur = (inputName) => {
		const newState = {}
		newState[inputName] = false
		setOnFocusInput({...onFocusInput, ...newState})
	}

	React.useEffect(() => {
		const {email, password} = loginValues
		const isValidEmail = onFocusInput.email || Boolean(email) ? true : !dirtyInputs.email
		const isValidPassword = onFocusInput.password || password.length >= 6 ? true : !dirtyInputs.password
		const emailError = {isValid: isValidEmail, message: isValidEmail ? '' : 'שדה חובה'}
		const passwordError = {isValid: isValidPassword, message: isValidPassword ? '' : 'לפחות ששה תווים'}
		setFormErrors(f => ({...f, emailError, passwordError}))
	}, [loginValues, onFocusInput, dirtyInputs])

	const handleFormSubmit = async () => {
		const {email, password} = loginValues;
		if (!email || !password) {
			let emailError = {isValid: Boolean(email), message: email ? 'שדה חובה' : ''}
			let passwordError = {isValid: password.length >= 6, message: password ? 'לפחות ששה תווים' : ''}
			setFormErrors({...formErrors, emailError, passwordError})

			return
		}
		try {
			const response = await authenticateEmail(email);
			const {status, data: {isUserRegistered, validEmail}} = response
			if (status === 'OK' && validEmail && !isUserRegistered) {
				setLoginSucess(true);
			} else if (!validEmail) {
				const emailError = {isValid: false, message: 'המייל לא תקין'}
				setFormErrors({...formErrors, emailError})
			} else if (isUserRegistered) {
				const emailError = {isValid: false, message: 'המייל קיים במערכת'}
				setFormErrors({...formErrors, emailError})
			}
		} catch (err) {
			if (err.message === 'Error: Request failed with status code 400') {
				const emailError = {isValid: false, message: 'המייל לא תקין'}
				setFormErrors({...formErrors, emailError})
			}
		}
	};

	return loginSuccess ? <Redirect to="/success" />
		: (
			<Modal id="login-modal">
				<SC.MainWrapper>
					<SC.Titles>
						<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
						<SC.SubTitleWrapper>
							<SC.SubTitle>כדי להשלים את הפעולה עליכם להיות מחוברים</SC.SubTitle>
							<SC.SubTitle>
								<span>עוד לא הצטרפתם? </span>
								<Link id="register-signin-link" text="הרשמו עכשיו" to="/sign/in" bold={true} />
							</SC.SubTitle>
						</SC.SubTitleWrapper>
					</SC.Titles>
					<SC.InputsWrapper>
						<SC.InputsTitle>כבר חברים בקהילה?</SC.InputsTitle>
						<SC.InputWrapper>
							<TextInput
								id="register-email-input"
								name="email"
								helperText={!formErrors.emailError.isValid && formErrors.emailError.message ? formErrors.emailError.message : ''}
								onFocus={onInputFocus}
								onBlur={onInputBlur}
								error={!formErrors.emailError.isValid}
								label="אימייל"
								type="email"
								value={loginValues.email}
								onChange={({ target: { value } }) => setLoginValues({ email: value, password: loginValues.password })} required />
						</SC.InputWrapper>
						<SC.InputWrapper>
							<TextInput
								id="register-password-input"
								name="password"
								helperText={!formErrors.passwordError.isValid && formErrors.passwordError.message ? formErrors.passwordError.message : ''}
								onFocus={onInputFocus}
								onBlur={onInputBlur}
								error={!formErrors.passwordError.isValid}
								label="סיסמא"
								type="password"
								forgetPassword = {true}
								value={loginValues.password}
								onChange={({ target: { value } }) => setLoginValues({ email: loginValues.email , password: value })}
								required />
                        </SC.InputWrapper>
					</SC.InputsWrapper>
					<SC.ButtonWrapper>
						<Button id="register-firststep-button" text="התחברות למעירים" onClick={handleFormSubmit} />
					</SC.ButtonWrapper>
				</SC.MainWrapper>
			</Modal>
		);
};

export default Login;
