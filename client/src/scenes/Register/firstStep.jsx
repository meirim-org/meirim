/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal, TextInput, Button, Link,
} from '../../shared';
import * as SC from './style';

const FirstStepSignup = ({ handleSubmit, values, setValues }) => {
	const { name, email, password } = values;

	return (
		<Modal>
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
					<SC.SubTitleWrapper>
						<SC.SubTitle>כדי להשלים את הפעולה עלכים להיות מחוברים</SC.SubTitle>
						<SC.SubTitle>
							<span>כבר רשומים? </span>
							<Link text="התחברות" bold={true} />
						</SC.SubTitle>
					</SC.SubTitleWrapper>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputsTitle>הרשמה למעירים</SC.InputsTitle>
					<SC.InputWrapper>
						<TextInput name="name" label="שם מלא" type="text" value={name} onChange={({ target: { value } }) => setValues({ name: value, email, password })} required />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput name="email" label="אימייל" type="email" value={email} onChange={({ target: { value } }) => setValues({ name, email: value, password })} required />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput name="password" label="סיסמא" type="password" value={password} onChange={({ target: { value } }) => setValues({ name, email, password: value })} required />
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך" onClick={handleSubmit} />
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
};

export default FirstStepSignup;
