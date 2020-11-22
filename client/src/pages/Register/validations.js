import { validateEmail } from '../../validations' 

export const firstStepValidation = ({ name, email, password }) => {
	const isValidEmail =  email ? validateEmail(email) : false
	const isValidName =  Boolean(name)
	const isValidPassword = password.length >= 6 

	return { isValidEmail, isValidName, isValidPassword }
}

export const formValidation = ({ name, email, password, dirtyInputs, onFocusInput }) => {
	const isValidEmail = 
		onFocusInput.email  || Boolean(email)? true : !dirtyInputs.email
	const isValidName = 
		onFocusInput.name  || Boolean(name) ? true : !dirtyInputs.name
	const isValidPassword = 
		onFocusInput.password  || password.length >= 6 ? true : !dirtyInputs.password

	return { isValidEmail, isValidName, isValidPassword }
}

const inValidEmailMessage = 'מייל לא תקין'
const emptyInputMessage = 'שדה חובה'
const shortPasswordMessage = 'לפחות ששה תווים'

export const getFormErrors = ({ 
	validations: { isValidEmail, isValidName, isValidPassword }, 
	values: { email, password } }) => {
	const emailError = { 
		isValid: isValidEmail,
		message: isValidEmail ? '' : email ? inValidEmailMessage : emptyInputMessage
	}
	const nameError = { 
		isValid: isValidName, 
		message: isValidName ? '' : 'שדה חובה' 
	}
	const passwordError = { 
		isValid: isValidPassword, 
		message: isValidPassword ? '' : password ? shortPasswordMessage : emptyInputMessage
	}

	return { emailError, nameError, passwordError }
}



