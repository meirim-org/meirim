import { ValidUserHook } from 'hooks';
import { useTranslation } from 'locale/he_IL';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { closeModal, openModal } from 'redux/modal/slice';
import { Button, Link, TextInput } from 'shared';
import { serverErrorToast, wrongLoginCredsToast, wrongLoginNotActivatedToast } from 'toasts';
import { validateEmail } from 'validations';
import { loginUser } from './controller';
import * as SC from './style';

const Login = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const firstUpdate = useRef(true);
	const [user, setUser] = useState(null); 
	const [loginValues, setLoginValues] = useState({ email: '', password: '' });
	const [onFocusInput, setOnFocusInput] = useState({ password: false, email: false });
	const [formErrors, setFormErrors] = useState({
		emailError: { isValid: true, message: '' }
	});
	const { t } = useTranslation();
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

	const validateBeforeFormSubmittion = (e) => {
		e.preventDefault();
		const isEmailValid = !getIsEmailInvalid();
		const emailError = { isValid: isEmailValid, message: isEmailValid ? '' : 'מייל לא תקין' };
		setFormErrors(ps => ({ ...ps, emailError }));
		if (isEmailValid) submitLoginForm();
	};

	const submitLoginForm = async () => {
		const res = await loginUser({ values: loginValues });
		const successResponse = res.status === 'OK';
		const wrongCredintials = res && res.response && res.response.status === 403;
		const notActivated = res && res.response && res.response.status === 401;
		const serverError = res && res.response && res.response.status === 504;
		if (successResponse) setUser(res.data);
		else if (wrongCredintials) wrongLoginCredsToast();
		else if (notActivated) wrongLoginNotActivatedToast();
		else if (serverError) serverErrorToast();
	};
	
	return (
		<SC.MainWrapper>
			<SC.Titles>
				<SC.Title>{t.signInToMeirim}</SC.Title>
				<SC.SubTitleWrapper>
					<SC.SubTitle>{t.loginToCompleteAction}</SC.SubTitle>
					<SC.SubTitle>
						<span>{t.didntJoinYet}</span>
						<Link id="login-signin-link" text={t.signupNow} onClick={() => dispatch(openModal({ modalType: 'register' }))} fontWeight="700" />
					</SC.SubTitle>
				</SC.SubTitleWrapper>
			</SC.Titles>
			<SC.InputsWrapper>
				<SC.InputsTitle>{t.alreadyMembers}</SC.InputsTitle>
				<SC.InputWrapper>
					<TextInput
						id="login-email-input"
						name="email"
						onFocus={onInputFocus}
						onBlur={onInputBlur}
						helperText={!formErrors.emailError.isValid && formErrors.emailError.message ? formErrors.emailError.message : ''}
						error={!formErrors.emailError.isValid}
						label={t.emailAddress}
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
						label={t.password}
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
				<Button id="login-button" text={t.signInToMeirim} onClick={validateBeforeFormSubmittion} />
			</SC.ButtonWrapper>
		</SC.MainWrapper>
	);
};

export default Login;
