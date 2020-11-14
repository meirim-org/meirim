import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal, TextInput, Button, Link,
} from '../../shared';
import * as SC from './style';

const FirstStepSignup = ({ handleSubmit, values, setValues, errors, inputFocus, inputBlur }) => {
	const { name, email, password } = values;
	const { nameError, emailError, passwordError } = errors
	
	return (
		<Modal id="register-firststep-modal">
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
					<SC.SubTitleWrapper>
						<SC.SubTitle>כדי להשלים את הפעולה עלכים להיות מחוברים</SC.SubTitle>
						<SC.SubTitle>
							<span>כבר רשומים? </span>
							<Link id="register-signin-link" text="התחברות" bold={true} />
						</SC.SubTitle>
					</SC.SubTitleWrapper>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputsTitle>הרשמה למעירים</SC.InputsTitle>
					<SC.InputWrapper>
						<TextInput
							id="register-name-input"
							name="name" 
							onFocus={inputFocus} 
							onBlur={inputBlur} 
							error={!nameError.isValid} 
							label="שם מלא" 
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
							label="אימייל" 
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
							label="סיסמא" 
							type="password"
							value={password}
							onChange={({ target: { value } }) => setValues({ name, email, password: value })} 
							required />
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button id="register-firststep-button" text="המשך" onClick={handleSubmit} />
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
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
