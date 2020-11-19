import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { authenticateEmail, registerUser  } from './handlers';
import FirstStepSignup from './firstStep';
import SecondStepSignup from './secondStep';
import { EMAIL_SENT_PAGE } from '../../router/contants'
import { firstStepValidation, formValidation, getFormErrors } from './validations'
import { personTypes } from './constants'

const SignupForms = () => {
	const [firstStepSuccess, setFirstStepSucess] = useState(false);
	const [secondStepSuccess, setSecondStepSucess] = useState(false);
	const [firstStepValues, setFirstStepValues] = useState({ name: '', password: '', email: '' });
	const [secondStepValues, setSecondStepValues] = useState({ type: personTypes[0].value, aboutme: '', address: '' });
	const [onFocusInput, setOnFocusInput] = useState({ name: false, password: false, email: false })
	const [dirtyInputs, setDirtyInputs] = useState({ name: false, email: false, password: false })
	const [formErrors, setFormErrors] = useState({
		emailError:{ isValid: true, message:'' },
		nameError:{ isValid: true, message:'' },
		passwordError:{ isValid: true, message:'' }
	})

	const onInputFocus = (inputName) => {
		const newState = {}
		newState[inputName] = true
		setDirtyInputs({ ...dirtyInputs, ...newState })
		setOnFocusInput({ ...onFocusInput, ...newState })
	}

	const onInputBlur = (inputName) => {
		const newState = {}
		newState[inputName] = false
		setOnFocusInput({ ...onFocusInput, ...newState })
	}

	useEffect(() => {
		const { email , name, password } = firstStepValues
		const { isValidEmail, isValidName, isValidPassword } = formValidation({ name ,email, password, onFocusInput, dirtyInputs })
		const { emailError, nameError, passwordError } = getFormErrors({ isValidEmail, isValidName, isValidPassword })
		setFormErrors(fe => ({ ...fe, emailError, nameError, passwordError }))
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
			toast.error('מצטערים, התהליך לא הצליח. נא לנסות שוב', {
				position: 'bottom-center',
				autoClose: false,
				hideProgressBar: true,
				closeOnClick: true,
				draggable: true,
			})
		}
	};

	const handleFirstFormSubmit = async () => {
		const { email , name, password } = firstStepValues
		const { isValidEmail, isValidName, isValidPassword } = firstStepValidation({ name ,email, password, onFocusInput, dirtyInputs })
		if(!isValidEmail || !isValidName || !isValidPassword){
			const { emailError, nameError, passwordError } = getFormErrors({ isValidEmail, isValidName, isValidPassword })
			setFormErrors({ ...formErrors, emailError, nameError, passwordError })
	
			return
		}
		try {
			const response = await authenticateEmail(email);
			const { status, data: { isUserRegistered, validEmail } } = response
			const successResponse = status === 'OK' && validEmail && !isUserRegistered
			const invalidEmail = !validEmail
			if (successResponse) {
				setFirstStepSucess(true);
			} else if (invalidEmail) {
				const emailError = { isValid: false, message: 'המייל לא תקין' }
				setFormErrors({ ...formErrors, emailError })
			} else if (isUserRegistered) {
				const emailError = { isValid: false, message: 'המייל קיים במערכת' }
				setFormErrors({ ...formErrors, emailError })
			}
		} catch (err) {
			if(err.message === 'Error: Request failed with status code 400'){
				const emailError = { isValid: false, message: 'המייל לא תקין' }
				setFormErrors({ ...formErrors, emailError })
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
