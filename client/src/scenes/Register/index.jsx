import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { authenticateEmail, registerUser } from './handlers';
import FirstStepSignup from './firstStep';
import SecondStepSignup from './secondStep';

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
	const [onFocusInput, setOnFocusInput] = useState({name: false, password: false, email: false})
	const [dirtyInputs, setDirtyInputs] = useState({name: false, email: false, password: false})
	const [formErrors, setFormErrors] = useState({
		emailError:{isValid: true, message:''},
		nameError:{isValid: true, message:''},
		passwordError:{isValid: true, message:''}
	})

	const onInputFocus = (inputName) => {
		const newState = {}
		newState[inputName] = true
		setDirtyInputs({...dirtyInputs, ...newState})
		setOnFocusInput({...onFocusInput, ...newState })
	}

	const onInputBlur = (inputName) => {
		const newState = {}
		newState[inputName] = false
		setOnFocusInput({...onFocusInput, ...newState })
	}

	React.useEffect(() => {
		const { email , name, password } = firstStepValues
		const isValidEmail = onFocusInput.email  || Boolean(email)? true : !dirtyInputs.email
		const isValidName = onFocusInput.name  || Boolean(name) ? true : !dirtyInputs.name
		const isValidPassword = onFocusInput.password  || password.length > 6 ? true : !dirtyInputs.password
		const emailError = {isValid: isValidEmail, message: email? 'שדה חובה' : ''}
		const nameError = {isValid: isValidName, message: name? 'שדה חובה' : ''}
		const passwordError = {isValid: isValidPassword, message: password? 'לפחות ששה תווים' : ''}
		setFormErrors({...formErrors, emailError, nameError, passwordError})
	}, [firstStepValues, onFocusInput, dirtyInputs])

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
			const response = await registerUser(requestData)
			if (response.status === 'OK') {
				setSecondStepSucess(true);
			}
		} catch (err) {
			// error handling for signup request
			console.log('err');
		}
	};

	const handleFirstFormSubmit = async () => {
		const { email , name, password } = firstStepValues
		if(!email || !name || !password) {
			let emailError = {isValid: Boolean(email), message: email? 'שדה חובה' : ''}
			let nameError = {isValid: Boolean(name), message: name? 'שדה חובה' : ''}
			let passwordError = {isValid: password.length > 6, message: password? 'לפחות ששה תווים' : ''}
			setFormErrors({...formErrors, emailError, nameError, passwordError})
			return
		}
		try {
			const response = await authenticateEmail(email);
			if (response.status === 'OK' && response.data.validEmail) {
				setFirstStepSucess(true);
			} else if (!response.data.validEmail) {
				const emailError = { isValid: false, message: 'המייל רשום במערכת'}
				setFormErrors({...formErrors, emailError})
			}
		} catch (err) {
			if(err.message === 'Error: Request failed with status code 400'){
				const emailError = { isValid: false, message: 'המייל לא תקין'}
				setFormErrors({...formErrors, emailError})
			}
		}
	};

	return firstStepSuccess && secondStepSuccess ? <Redirect to="/email-sent" /> : firstStepSuccess
		? (
			<SecondStepSignup
				errors={formErrors}
				values={secondStepValues}
				setValues={setSecondStepValues}
				handleSubmit={handleSecondFormSubmit}
			/>
		)
		: (
			<FirstStepSignup
				errors={formErrors}
				inputFocus={onInputFocus}
				inputBlur={onInputBlur}
				values={firstStepValues}
				setValues={setFirstStepValues}
				handleSubmit={handleFirstFormSubmit}
			/>
		);
};

export default SignupForms;
