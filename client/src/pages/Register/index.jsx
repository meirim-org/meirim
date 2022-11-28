import React, { useEffect, useState, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EMAIL_SENT_PAGE } from 'router/contants';
import { closeModal } from 'redux/modal/slice';
import { authenticateEmail, registerUser  } from './controller';
import FirstStepSignup from './firstStep';
import SecondStepSignup from './secondStep';
import { formValidation, fieldError } from './validations';
import { useDispatch } from 'react-redux';

const SignupForms = () => {
	const dispatch = useDispatch();
	const [firstStepSuccess, setFirstStepSucess] = useState(false);
	const [secondStepSuccess, setSecondStepSucess] = useState(false);
	const [firstStepValues, setFirstStepValues] = useState({ name: '', password: '', email: '' });
	const [secondStepValues, setSecondStepValues] = useState({ type: '', aboutme: '', address: '' });
	const [focusedInput, setFocusedInput] = useState('');
	const [touchedInputs, setTouchedInputs] = useState({
		name: false,
		password: false,
		email: false,
		type: false
	});
	const [fieldValidations, setFieldValidations] = useState({ name: '', password: '', email: '', type: '' });

	const onInputBlur = (inputName) =>{
		if (focusedInput === inputName) {
			setFocusedInput('');
		}
		setTouchedInputs(inputs => ({ ...inputs, [inputName]: true }));
	};

	useEffect(() => {
		setFieldValidations(formValidation({ ...firstStepValues, ...secondStepValues }));
	}, [firstStepValues, secondStepValues]);

	const errors = useMemo(() => ({
		name: fieldError('name', fieldValidations, touchedInputs, focusedInput),
		password: fieldError('password', fieldValidations, touchedInputs, focusedInput),
		email: fieldError('email', fieldValidations, touchedInputs, focusedInput),
		type: fieldError('type', fieldValidations, touchedInputs, focusedInput),
	}), [fieldValidations, touchedInputs, focusedInput]);

	const handleSecondFormSubmit = async () => {
		setTouchedInputs({ ...touchedInputs, type: true });
		if (fieldValidations.type) {
			return;
		}
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
			const response = await registerUser(requestData);
			const success = response.status === 'OK';
			if (success) {
				setSecondStepSucess(true);
				dispatch(closeModal());
			}
		} catch (err) {
			toast.error('מצטערים, התהליך לא הצליח. נא לנסות שוב', {
				position: 'bottom-center',
				autoClose: false,
				hideProgressBar: true,
				closeOnClick: true,
				draggable: true,
			});
		}
	};

	const handleFirstFormSubmit = async () => {
		setTouchedInputs({ ...touchedInputs, name: true, password: true, email: true });
		if (fieldValidations.name || fieldValidations.password || fieldValidations.email) {
			return;
		}
		const { email } = firstStepValues;
		try {
			const response = await authenticateEmail(email);
			const { status, data: { isUserRegistered } } = response;
			const successResponse = status === 'OK' && !isUserRegistered;
			if (successResponse) {
				setFirstStepSucess(true);
			} else if (isUserRegistered) {
				setFieldValidations({ ...fieldValidations, email: 'המייל קיים במערכת' });
			}
		} catch (err) {
			if (err.message === 'Error: Request failed with status code 400'){
				setFieldValidations({ ...fieldValidations, email: 'המייל לא תקין' });
			}
		}
	};

	return firstStepSuccess && secondStepSuccess ?
		<Redirect to={{ pathname: EMAIL_SENT_PAGE, state: { email: firstStepValues.email } }} /> : firstStepSuccess
			? (
				<SecondStepSignup
					values={secondStepValues}
					setValues={setSecondStepValues}
					errors={errors}
					inputFocus={field => setFocusedInput(field)}
					inputBlur={onInputBlur}
					handleSubmit={handleSecondFormSubmit}
				/>
			)
			: (
				<FirstStepSignup
					values={firstStepValues}
					setValues={setFirstStepValues}
					errors={errors}
					inputFocus={field => setFocusedInput(field)}
					inputBlur={onInputBlur}
					handleSubmit={handleFirstFormSubmit}
				/>
			);
};

export default SignupForms;
