import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { validateEmail } from 'validations';
import { Button, TextInput, Link } from 'shared';
import { wrongLoginCredsToast, serverErrorToast } from 'toasts';
import { ValidUserHook } from 'hooks';
import { openModal, closeModal } from 'redux/modal/slice';
import { loginUser } from './controller';
import t from 'locale/he_IL';
import * as SC from './style';
import { useDispatch } from 'react-redux';

const Login = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const firstUpdate = useRef(true);
	const [user, setUser] = useState(null); 
	const [loginValues, setLoginValues] = useState({ email: '', password: '' });
	const [onFocusInput, setOnFocusInput] = useState({ password: false, email: false });
	const [formErrors, setFormErrors] = useState({
		emailError: { isValid: true, message: '' },
		passwordError: { isValid: true, message: '' }
	});

	ValidUserHook(user);

	const getIsEmailInvalid = React.useCallback(() => 
		onFocusInput.email ? false : !validateEmail(loginValues.email), [loginValues.email, onFocusInput.email]);
	const formValidation = React.useCallback(() => {
		const isEmailInvalid = getIsEmailInvalid(); 
		const emailError = { isValid: !isEmailInvalid, message: !isEmailInvalid ? '' : 'מייל לא תקין' };
		setFormErrors(ps => ({ ...ps, emailError }));
	}, [getIsEmailInvalid]);
	
	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
		} else {
			formValidation();
		}
	},[loginValues, onFocusInput, formValidation]);

	const onInputFocus = (inputName) => {
		const newState = {};
		newState[inputName] = true;
		setOnFocusInput(ps => ({ ...ps, ...newState }));
	};

	const onInputBlur = (inputName) => {
		const newState = {};
		newState[inputName] = false;
		setOnFocusInput(ps => ({ ...ps, ...newState }) );
	};

	const getIsPasswordInvalid = () => onFocusInput.password ? false : loginValues.password.length < 6;

	const validateBeforeFormSubmittion = (e) => {
		e.preventDefault();
		const isEmailValid = !getIsEmailInvalid();
		const isPasswordValid = !getIsPasswordInvalid();
		const emailError = { isValid: isEmailValid, message: isEmailValid ? '' : 'מייל לא תקין' };
		const passwordError = { isValid: isPasswordValid, message: isPasswordValid ? '' : 'סיסמה לא תקינה' };
		setFormErrors(ps => ({ ...ps, emailError, passwordError }));
		if (isEmailValid && isPasswordValid) submitLoginForm();
	};

	const submitLoginForm = async () => {
		const res = await loginUser({ values: loginValues }); 
		const successResponse = res.status === 'OK';
		const wrongCredintials = res && res.response && res.response.status === 403;
		const serverError = res && res.response && res.response.status === 504;
		if (successResponse) setUser(res.data);
		else if (wrongCredintials) wrongLoginCredsToast();
		else if (serverError) serverErrorToast();
	};
	
	return (
		<SC.MainWrapper>
			<SC.Titles>
				<SC.Title>התחברות למעירים</SC.Title>
				<SC.SubTitleWrapper>
					<SC.SubTitle>כדי להשלים את הפעולה עליכם להיות מחוברים</SC.SubTitle>
					<SC.SubTitle>
						<span>עוד לא הצטרפתם? </span>
						<Link id="login-signin-link" text="הרשמו עכשיו" onClick={() => dispatch(openModal({ modalType: 'register' }))} fontWeight="700" />
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
						label="סיסמא"
						type="password"
						forgetPassword = {true}
						value={loginValues.password}
						onChange={({ target: { value } }) => setLoginValues({ email: loginValues.email , password: value })}
						required />
					<SC.ForgotPassword>
						<u><SC.ForgotPasswordButton id="forgot-password" onClick={() => {
							dispatch(closeModal());
							
							return history.push('/forgot');
						}}>{t.forgotMyPassword}</SC.ForgotPasswordButton></u>
					</SC.ForgotPassword>
				</SC.InputWrapper>
			</SC.InputsWrapper>
			<SC.ButtonWrapper>
				<Button id="login-button" text="התחברות למעירים" onClick={validateBeforeFormSubmittion} />
			</SC.ButtonWrapper>
		</SC.MainWrapper>
	);
};

export default Login;
