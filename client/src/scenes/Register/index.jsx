import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { authenticateEmail, registerUser  } from './handlers';
import FirstStepSignup from './firstStep';
import SecondStepSignup from './secondStep';
import { EMAIL_SENT_PAGE } from '../../router/contants'

const formValidation = ({ name, email, password, dirtyInputs, onFocusInput }) => {
	const isValidEmail = onFocusInput.email  || Boolean(email)? true : !dirtyInputs.email
	const isValidName = onFocusInput.name  || Boolean(name) ? true : !dirtyInputs.name
	const isValidPassword = onFocusInput.password  || password.length >= 6 ? true : !dirtyInputs.password

	return { isValidEmail, isValidName, isValidPassword }
}

const getFormErrors = ({isValidEmail, isValidName, isValidPassword}) => {
	const emailError = {isValid: isValidEmail, message: isValidEmail? '' : 'שדה חובה'}
	const nameError = {isValid: isValidName, message: isValidName ? '' : 'שדה חובה'}
	const passwordError = {isValid: isValidPassword, message: isValidPassword ? '' : 'לפחות ששה תווים'}

	return {emailError, nameError, passwordError}
}

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
		const { isValidEmail, isValidName, isValidPassword } = formValidation({name ,email, password, onFocusInput, dirtyInputs})
		const { emailError, nameError, passwordError } = getFormErrors({isValidEmail, isValidName, isValidPassword})
		setFormErrors(fe => ({...fe, emailError, nameError, passwordError}))
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
				if(address.length) { registerUserAlert(address) }
				setSecondStepSucess(true);
			}
		} catch (err) {
			console.log('err');
		}
	};

	const handleFirstFormSubmit = async () => {
		const { email , name, password } = firstStepValues
		if(!email || !name || !password) {
			const { isValidEmail, isValidName, isValidPassword } = formValidation({name ,email, password, onFocusInput, dirtyInputs})
			const { emailError, nameError, passwordError } = getFormErrors({isValidEmail, isValidName, isValidPassword})
			setFormErrors({...formErrors, emailError, nameError, passwordError})
	
			return
		}
		try {
			const response = await authenticateEmail(email);
			const { status, data: { isUserRegistered, validEmail } } = response
			if (status === 'OK' && validEmail && !isUserRegistered) {
				setFirstStepSucess(true);
			} else if (!validEmail) {
				const emailError = { isValid: false, message: 'המייל לא תקין'}
				setFormErrors({...formErrors, emailError})
			} else if (isUserRegistered) {
				const emailError = { isValid: false, message: 'המייל קיים במערכת'}
				setFormErrors({...formErrors, emailError})
			}
		} catch (err) {
			if(err.message === 'Error: Request failed with status code 400'){
				const emailError = { isValid: false, message: 'המייל לא תקין'}
				setFormErrors({...formErrors, emailError})
			}
		}
	};

	return firstStepSuccess && secondStepSuccess ? <Redirect to={EMAIL_SENT_PAGE} /> : firstStepSuccess
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
