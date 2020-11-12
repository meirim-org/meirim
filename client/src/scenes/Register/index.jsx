/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Redirect } from "react-router-dom"
import { authenticateEmail, registerUser } from './handlers';
import FirstStepSignup from './firstStep';
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
	const [onFocusInput, setOnFocusInput] = useState({name: false, password: false, email: false})
	const [dirtyInputs, setDirtyInputs] = useState({name: false, email: false, password: false})

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

	const [formErrors, setFormErrors] = useState({
		emailError:{isValid: true, message:''},
		nameError:{isValid: true, message:''},
		passwordError:{isValid: true, message:''}
	})

	React.useEffect(() => {
		const { email , name, password } = firstStepValues
		let emailError = {isValid: onFocusInput.email  || Boolean(email)? true : !dirtyInputs.email, message: Boolean(email)? 'שדה חובה' : ''}
		let nameError = {isValid: onFocusInput.name  || Boolean(name) ? true : !dirtyInputs.name , message: Boolean(name)? 'שדה חובה' : ''}
		let passwordError = {isValid: onFocusInput.password  || Boolean(password) ? true : !dirtyInputs.password, message: Boolean(password)? 'שדה חובה' : ''}
		setFormErrors({...formErrors, emailError, nameError, passwordError})
	}, [firstStepValues, onFocusInput])

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
    console.log("handleSecondFormSubmit -> requestData", requestData)
		try {
			const response = await registerUser(requestData)
			if (response.status === 'OK') {
				setSecondStepSucess(true);
			}
		} catch (err) {
			console.log('err');
		}
	};

	const handleFirstFormSubmit = async () => {
		const { emailError, nameError, passwordError} = formErrors
		const { email , name, password } = firstStepValues
		if(!email || !name || !password) {
			let emailError = {isValid: Boolean(email), message: Boolean(email)? 'שדה חובה' : ''}
			let nameError = {isValid: Boolean(name), message: Boolean(name)? 'שדה חובה' : ''}
			let passwordError = {isValid: Boolean(password), message: Boolean(password)? 'שדה חובה' : ''}
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
			} else if(response.data === "Email is not valid"){
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
