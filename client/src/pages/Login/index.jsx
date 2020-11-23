/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify'
import { loginUser } from './controller'
import { validateEmail } from '../../validations'
import { Button, Link, Modal, TextInput } from '../../shared';
import * as SC from './style';

const Login = ({ ...props }) => {
	const { history, setMe } = props
	const firstUpdate = useRef(true);
	const [loginValues, setLoginValues] = useState({ email: '', password: '' });
	const [onFocusInput, setOnFocusInput] = useState({ password: false, email: false })
	const [formErrors, setFormErrors] = useState({
		emailError: { isValid: true, message: '' },
		passwordError: { isValid: true, message: '' }
	})

	const onInputFocus = (inputName) => {
		const newState = {}
		newState[inputName] = true
		setOnFocusInput(ps => ({ ...ps, ...newState }))
	}

	const onInputBlur = (inputName) => {
		const newState = {}
		newState[inputName] = false
		setOnFocusInput(ps => ({ ...ps, ...newState }) )
	}

	const getIsEmailInvalid = () => onFocusInput.email ? false : !validateEmail(loginValues.email)
	const getIsPasswordInvalid = () => onFocusInput.password ? false : loginValues.password.length < 6

	const formValidation = () => {
		const isEmailInvalid = getIsEmailInvalid() 
		const emailError = { isValid: !isEmailInvalid, message: !isEmailInvalid ? '' : 'מייל לא תקין' }
		setFormErrors(ps => ({ ...ps, emailError }))
	}

	useEffect(() => {
		if(firstUpdate.current) {
			firstUpdate.current = false
		}
		else {
			formValidation()
		}
	},[loginValues, onFocusInput])

	const handleFormSubmit = async () => {
		const isEmailValid = !getIsEmailInvalid()
		const isPasswordValid = !getIsPasswordInvalid()
		const emailError = { isValid: isEmailValid, message: isEmailValid ? '' : 'מייל לא תקין' }
		const passwordError = { isValid: isPasswordValid, message: isPasswordValid ? '' : 'סיסמה לא תקינה' }
		setFormErrors(ps => ({ ...ps, emailError, passwordError }))
		if(isEmailValid && isPasswordValid) {
			const res = await loginUser({ values: loginValues }) 
			if (res.status === 'OK') {
				setMe(true)

				return history.push({
					pathname: '/alerts',
				})
			} else if(res.response.status === 403){
				toast.error('הסיסמה או שם המשתמש אינם נכונים', {
					toastId: '403message',
					position: 'bottom-center',
					autoClose: false,
					hideProgressBar: true,
					closeOnClick: true,
					draggable: true,
				})
					
				return
			} else if (res.response.status === 504){
				toast.error('מתנצלים, יש שגיאה בצד שלנו. נא לנסות שוב', {
					toastId: '504message',
					position: 'bottom-center',
					autoClose: false,
					hideProgressBar: true,
					closeOnClick: true,
					draggable: true,
				})
					
				return
			} 
		}
	}
	
	return (
		<Modal id="login-modal">
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
					<SC.SubTitleWrapper>
						<SC.SubTitle>כדי להשלים את הפעולה עליכם להיות מחוברים</SC.SubTitle>
						<SC.SubTitle>
							<span>עוד לא הצטרפתם? </span>
							<Link id="login-signin-link" text="הרשמו עכשיו" to="/sign/up" bold={'700'} />
						</SC.SubTitle>
					</SC.SubTitleWrapper>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputsTitle>כבר חברים בקהילה?</SC.InputsTitle>
					<SC.InputWrapper>
						<TextInput
							id="login-email-input"
							name="email"
							onFocus={onInputFocus}
							onBlur={onInputBlur}
							helperText={!formErrors.emailError.isValid && formErrors.emailError.message ? formErrors.emailError.message : ''}
							error={!formErrors.emailError.isValid}
							label="אימייל"
							type="email"
							value={loginValues.email}
							onChange={({ target: { value } }) => setLoginValues({ email: value, password: loginValues.password })} required />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput
							id="login-password-input"
							name="password"
							onFocus={onInputFocus}
							onBlur={onInputBlur}
							helperText={!formErrors.passwordError.isValid && formErrors.passwordError.message ? formErrors.passwordError.message : ''}
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
					<Button id="login-button" text="התחברות למעירים" onClick={handleFormSubmit} />
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
	);
};

export default Login;
