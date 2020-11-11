/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SuccessMessage from '../successMessage';
import {
	Modal, Dropdown, TextInput, TextArea, Button, Link,
} from '../../../shared';
import { validateForm } from '../validate';
import api from '../../../services/api';
import * as SC from './style';

const dropDownOptions = [
	{
		value: '1',
		text: ' תושב/ת שכאפת לו/ה',
	},
	{
		value: '2',
		text: 'אתה אתה אתה',
	},
	{
		value: '3',
		text: 'אני אני אני',
	},
];

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
							כבר רשומים?
							<Link text="התחברות" />
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

const SecondStepSignup = ({ handleSubmit, values, setValues }) => {
	const { address, type, aboutme } = values;

	return (
		<Modal>
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputWrapper>
						<TextInput name="adress" label="כתובת" type="text" value={address} onChange={({ target: { value } }) => setValues({ type, aboutme, address: value })} helperText="כדי לקבל עדכונים על מה בונים לך ליד הבית" />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<Dropdown value={type} onChange={({ target: { value } }) => setValues({ type: value, aboutme, address })} options={dropDownOptions} required label="מי אני" />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextArea value={aboutme} onChange={({ target: { value } }) => setValues({ type, aboutme: value, address })} helperText="כדי ששאר חברי הקהילה יכירו אותך" label="קצת עליך" />
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך" onClick={handleSubmit} />
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
	);
};

SecondStepSignup.propTypes = {
	values: PropTypes.shape({
		address: PropTypes.string,
		type: PropTypes.string.isRequired,
		aboutme: PropTypes.string,
	}).isRequired,
	setValues: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

const SignupForms = () => {
	const [firstStepSuccess, setFirstStepSucess] = useState(false);
	const [secondStepSuccess, setSecondStepSucess] = useState(false);
	const [firstStepValues, setFirstStepValues] = useState({ name: '', password: '', email: '' });
	const [secondStepValues, setSecondStepValues] = useState({ type: dropDownOptions[0].value, aboutme: '', address: '' });

	const handleSecondFormSubmit = async () => {
		const { aboutme, type, address } = secondStepValues;
		const { name, password, email } = firstStepValues;
		const requestData = {
			name,
			password,
			email,
			about_me: aboutme,
			type,
			address,
		};
		try {
			const response = await api.post('/sign/up', { ...requestData });
			if (response.status === 'OK') {
				setSecondStepSucess(true);
			}
		} catch (err) {
			console.log('err');
		}
	};

	const handleFirstFormSubmit = async () => {
		const { email } = firstStepValues;
		try {
			const response = await api.post('/sign/auth/email', {
				email,
			});
			if (response.status === 'OK' && response.data.validEmail) {
				setFirstStepSucess(true);
			}
		} catch (err) {
			console.log('err in post request', err);
		}
	};

	return firstStepSuccess && secondStepSuccess ? <SuccessMessage /> : firstStepSuccess
		? (
			<SecondStepSignup
				values={secondStepValues}
				setValues={setSecondStepValues}
				handleSubmit={handleSecondFormSubmit}
			/>
		)
		: (
			<FirstStepSignup
				values={firstStepValues}
				setValues={setFirstStepValues}
				handleSubmit={handleFirstFormSubmit}
			/>
		);
};

export default SignupForms;
