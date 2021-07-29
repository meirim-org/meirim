import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import { Button, Link, TextInput } from 'shared';
import * as SC from './style';

const FirstStepSignup = ({ handleSubmit, values, setValues, errors, inputFocus, inputBlur }) => {
	const dispatch = useDispatch();
	const { name, email, password } = values;
	const { nameError, emailError, passwordError } = errors;
	const { t } = useTranslation();

	return (
		<SC.MainWrapper>
			<SC.Titles>
				<SC.Title>{t.joinMeirimCommunity}</SC.Title>
				<SC.SubTitleWrapper>
					<SC.SubTitle>{t.loginToCompleteAction}</SC.SubTitle>
					<SC.SubTitle>
						<span>{t.alreadySignedup}</span>
						<Link id="register-signin-link" text={t.signin} onClick={() => dispatch(openModal({ modalType: 'login' }))} fontWeight="700" />
					</SC.SubTitle>
				</SC.SubTitleWrapper>
			</SC.Titles>
			<SC.InputsWrapper>
				<SC.InputsTitle>{t.signupToMeirim} </SC.InputsTitle>
				<SC.InputWrapper>
					<TextInput
						id="register-name-input"
						name="name"
						onFocus={inputFocus}
						onBlur={inputBlur}
						error={!nameError.isValid}
						label={t.fullName}
						type="text"
						value={name}
						onChange={({ target: { value } }) => setValues({ name: value, email, password })}
						required />
				</SC.InputWrapper>
				<SC.InputWrapper>
					<TextInput
						id="register-email-input"
						name="email"
						helperText={!emailError.isValid && emailError.message ? emailError.message : ''}
						onFocus={inputFocus}
						onBlur={inputBlur}
						error={!emailError.isValid}
						label={t.emailAddress}
						type="email"
						value={email}
						onChange={({ target: { value } }) => setValues({ name, email: value, password })} required />
				</SC.InputWrapper>
				<SC.InputWrapper>
					<TextInput
						id="register-password-input"
						name="password"
						helperText={!passwordError.isValid && passwordError.message ? passwordError.message : ''}
						onFocus={inputFocus}
						onBlur={inputBlur}
						error={!passwordError.isValid}
						label={t.password}
						type="password"
						value={password}
						onChange={({ target: { value } }) => setValues({ name, email, password: value })}
						required />
				</SC.InputWrapper>
			</SC.InputsWrapper>
			<SC.ButtonWrapper>
				<Button id="register-firststep-button" text={t.continue} onClick={handleSubmit} />
			</SC.ButtonWrapper>
		</SC.MainWrapper>
	);
};

FirstStepSignup.propTypes = {
	values: PropTypes.shape({
		name: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		password: PropTypes.string.isRequired,
	}).isRequired,
	setValues: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	inputFocus: PropTypes.func,
	inputBlur: PropTypes.func,
};

export default FirstStepSignup;
