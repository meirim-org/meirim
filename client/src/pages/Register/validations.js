import { validateEmail } from '../../validations' 

export const firstStepValidation = ({ name, email, password }) => {
	const isValidEmail =  email ? validateEmail(email) : false
	const isValidName =  Boolean(name)
	const isValidPassword = password.length >= 6 

	return { isValidEmail, isValidName, isValidPassword }
}

export const secondStepValidation = ({ type }) => {
	const isTypeValid = type!== undefined && type !==''

	return { isTypeValid }
};

export const formValidation = ({ name, email, password, type, dirtyInputs, onFocusInput }, isSecondStep) => {
	const isValidEmail = 
		onFocusInput.email  || validateEmail(email)? true : !dirtyInputs.email
	const isValidName = 
		onFocusInput.name  || Boolean(name) ? true : !dirtyInputs.name
	const isValidPassword = 
		onFocusInput.password  || password.length >= 6 ? true : !dirtyInputs.password

	if(!isSecondStep) return { isValidEmail, isValidName, isValidPassword }

	const isValidType = 
		onFocusInput.type  || type!== '' ? true : !dirtyInputs.type

	return  { isValidType }
}

const inValidEmailMessage = 'מייל לא תקין'
const emptyInputMessage = 'שדה חובה'
const shortPasswordMessage = 'לפחות ששה תווים'
const emptyString = ''

export const getFormErrors = ({ 
	validations: { isValidEmail, isValidName, isValidPassword }, 
	values: { email, password } }) => {
	const emailError = { 
		isValid: isValidEmail,
		message: isValidEmail ? emptyString : email ? inValidEmailMessage : emptyInputMessage
	}
	const nameError = { 
		isValid: isValidName, 
		message: isValidName ? emptyString : emptyInputMessage
	}
	const passwordError = { 
		isValid: isValidPassword, 
		message: isValidPassword ? emptyString : password ? shortPasswordMessage : emptyInputMessage
	}

	return { emailError, nameError, passwordError }
}



