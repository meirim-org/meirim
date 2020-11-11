/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { authenticateEmail, registerUser } from './handlers';
// import { validateForm } from '../validate';
import FirstStepSignup from './firstStep';
import EmailSent from './emailSent';
import SecondStepSignup from './secondStep';
import SuccessMessage from './emailVerified.jsx';

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
			const response = await authenticateEmail();
			if (response.status === 'OK' && response.data.validEmail) {
				setFirstStepSucess(true);
			}
		} catch (err) {
			console.log('err in post request', err);
		}
	};

	return firstStepSuccess && secondStepSuccess ? <EmailSent /> : firstStepSuccess
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
